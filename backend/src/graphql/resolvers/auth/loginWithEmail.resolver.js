import { ForbiddenError } from 'apollo-server-core';
import analytics from '~services/analytics';
import dayjs from '~utils/dayjs';
import QueryError from '~utils/errors/QueryError';
import { Fail, Success } from '~helpers/response';
import emailTemplates from '~helpers/emailTemplates';
import {
  INCORRECT_EMAIL,
  INCORRECT_PASSWORD,
  USER_BLOCKED,
  WELCOME_BACK,
} from '~helpers/constants/responseCodes';
import { FAILED_LOGIN_ATTEMPT_KEY_PREFIX, MAX_LOGIN_ATTEMPTS, MAX_LOCK_ATTEMPTS } from '~helpers/constants/auth';
import { ACCOUNT_STATUS } from '~helpers/constants/models';

const findUserByEmail = async (dataSources, email) => {
  return await dataSources.users.findOne({ where: { email } });
};

const checkIfBlocked = (user) => {
  if (user.status === ACCOUNT_STATUS.BLOCKED) throw new QueryError(USER_BLOCKED);
};

const checkIfLocked = (user) => {
  const lockedDuration = 3 * 60 * 1000; // 3 minutes
  const lockedUntil = dayjs(user.updatedAt).add(lockedDuration, 'ms');
  if (user.status === ACCOUNT_STATUS.LOCKED && dayjs().isBefore(lockedUntil)) {
    const waitTime = lockedUntil.diff(dayjs(), 'minute');
    throw new QueryError(`Account is locked. Try again in ${waitTime} minutes.`);
  }
};

const handleFailedLoginAttempts = async (dataSources, cache, mailer, user, email, locale) => {
  const attemptCountKey = `${FAILED_LOGIN_ATTEMPT_KEY_PREFIX}:${email}`;
  const lockCountKey = `${FAILED_LOGIN_ATTEMPT_KEY_PREFIX}:lock:${email}`;
  const attempts = await cache.increment(attemptCountKey);

  if (attempts > MAX_LOGIN_ATTEMPTS) {
    await cache.remove(attemptCountKey); // Reset login attempts after locking the account

    const lockAttempts = await cache.increment(lockCountKey);
    if (lockAttempts >= MAX_LOCK_ATTEMPTS) {
      await blockUser(dataSources, mailer, user, locale);
      throw new QueryError(USER_BLOCKED);
    }

    await lockUser(dataSources, mailer, user, locale);
    throw new QueryError(`Account locked due to multiple failed login attempts. Try again in 3 minutes.`);
  }

  throw new QueryError(`${INCORRECT_PASSWORD} ${attempts}`);
};

const blockUser = async (dataSources, mailer, user, locale) => {
  await dataSources.users.update(user.id, { status: ACCOUNT_STATUS.BLOCKED });

  analytics.track({
    userId: user.id,
    event: 'User Blocked',
    properties: {
      email: user.email,
      fullName: user.fullName,
    },
  });

  mailer.sendEmail({
    template: emailTemplates.USER_BLOCKED,
    message: { to: user.email },
    locals: { locale, name: user.firstName },
  });
};

const lockUser = async (dataSources, mailer, user, locale) => {
  await dataSources.users.update(user.id, { status: ACCOUNT_STATUS.LOCKED });

  analytics.track({
    userId: user.id,
    event: 'Login Suspicion',
    properties: {
      email: user.email,
      fullName: user.fullName,
    },
  });

  mailer.sendEmail({
    template: emailTemplates.FAILED_LOGIN,
    message: { to: user.email },
    locals: { locale, name: user.firstName },
  });
};

const handleSuccessfulLogin = async (dataSources, jwt, cache, analytics, user, clientId) => {
  const { id, firstName } = user;

  await dataSources.users.update(id, {
    lastLogin: dayjs.utc().toDate(),
    status: ACCOUNT_STATUS.ACTIVE, 
  });

  const { accessToken, refreshToken, sid, exp } = await jwt.getAuthTokens(id, { clientId });
  await cache.set(`${clientId}:${id}`, sid, exp);

  analytics.track({
    userId: id,
    event: 'Logged In',
    properties: { provider: 'email' },
  });

  return { firstName, accessToken, refreshToken, user };
};

export default {
  Mutation: {
    async loginWithEmail(
      _parent,
      { input },
      { dataSources, jwt, t, cache, mailer, locale, clientId },
    ) {
      try {
        const user = await findUserByEmail(dataSources, input.email);
        if (!user) throw new QueryError(INCORRECT_EMAIL);

        checkIfBlocked(user);
        checkIfLocked(user);

        const granted = await user.checkPassword(input.password);
        if (!granted) {
          await handleFailedLoginAttempts(dataSources, cache, mailer, user, input.email, locale);
        }

        await cache.remove(`${FAILED_LOGIN_ATTEMPT_KEY_PREFIX}:${input.email}`);
        await cache.remove(`${FAILED_LOGIN_ATTEMPT_KEY_PREFIX}:lock:${input.email}`); 

        const { firstName, accessToken, refreshToken, user: updatedUser } = await handleSuccessfulLogin(
          dataSources, jwt, cache, analytics, user, clientId
        );

        return Success({
          message: t(WELCOME_BACK, { firstName }),
          code: WELCOME_BACK,
          accessToken,
          refreshToken,
          user: updatedUser,
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
