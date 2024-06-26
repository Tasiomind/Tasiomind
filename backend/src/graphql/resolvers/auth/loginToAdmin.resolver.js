import { GraphQLError } from 'graphql';
import dayjs from '~utils/dayjs';
import analytics from '~services/analytics';
import QueryError from '~utils/errors/QueryError';
import emailTemplates from '~helpers/emailTemplates';
import { Fail, Success } from '~helpers/response';
import {
  EMAIL_NOT_VERIFIED,
  INCORRECT_USERNAME_OR_PASSWORD,
  WELCOME_BACK,
} from '~helpers/constants/responseCodes';
import { FAILED_LOGIN_ATTEMPT_KEY_PREFIX, MAX_LOGIN_ATTEMPTS } from '~helpers/constants/auth';
import { ACCOUNT_STATUS, ROLES_ALIAS } from '~helpers/constants/models';

export default {
  Mutation: {
    async loginToAdmin(
      _parent,
      { input },
      { dataSources, jwt, t, cache, mailer, locale, clientId },
    ) {
      try {
        const user = await dataSources.users.findOne({
          where: {
            username: input.username,
          },
          include: [
            {
              association: ROLES_ALIAS,
              where: {
                name: ['root', 'admin'],
              },
            },
          ],
        });

        const granted = await user?.checkPassword(input.password);

        if (user && granted && !user.emailVerified) {
          throw new QueryError(EMAIL_NOT_VERIFIED);
        }

        const attemptCountKey = `${FAILED_LOGIN_ATTEMPT_KEY_PREFIX}:${input.username}`;
        if (user && !granted) {
          const attempts = await cache.increment(attemptCountKey);
          if (attempts === MAX_LOGIN_ATTEMPTS) {
            await dataSources.users.update(user.id, {
              status: ACCOUNT_STATUS.LOCKED,
            });
            mailer.sendEmail({
              template: emailTemplates.FAILED_LOGIN,
              message: {
                to: user.email,
              },
              locals: {
                locale,
                name: user.firstName,
              },
            });
          }
        }

        if (!granted) {
          throw new QueryError(INCORRECT_USERNAME_OR_PASSWORD);
        }

        if ([ACCOUNT_STATUS.BLOCKED, ACCOUNT_STATUS.LOCKED].includes(user.status)) {
          throw new GraphQLError(user.status);
        }

        await cache.remove(attemptCountKey);

        const { id, firstName } = user;

        await dataSources.users.update(id, {
          lastLogin: dayjs.utc().toDate(),
        });

        const { accessToken, refreshToken, sid, exp } = await jwt.getAuthTokens(id, {
          clientId,
        });

        await cache.set(`${clientId}:${id}`, sid, exp);

        analytics.track({
          userId: id,
          event: 'Logged In Admin',
        });
        //TODO! res.cookie refreshToken

        return Success({
          message: t(WELCOME_BACK, { firstName }),
          code: WELCOME_BACK,
        });
      } catch (e) {
        if (e instanceof QueryError) {
          return Fail({
            message: t(e.message),
            code: e.code,
          });
        }
        throw e;
      }
    },
  },
};
