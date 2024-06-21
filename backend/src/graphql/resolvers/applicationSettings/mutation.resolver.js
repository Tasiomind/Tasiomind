import QueryError from '~utils/errors/QueryError';
import { Fail, Success } from '~helpers/response';
import {
  APPLICATION_CREATED,
  APPLICATION_DELETED,
  APPLICATION_UPDATED,
} from '~helpers/constants/responseCodes';
import { CLIENTS_CACHE_KEY } from '~helpers/constants/auth';

export default {
  Mutation: {
    async createApplicationSettings(_parent, { input }, { dataSources, t, cache, currentUser }) {
      try {
        const application = await dataSources.applicationSettings.create({
          ...input,
          userId: currentUser.id,
        });

        await cache.remove(CLIENTS_CACHE_KEY);

        return Success({
          application,
          code: APPLICATION_CREATED,
          message: t(APPLICATION_CREATED),
        });
      } catch (e) {
        if (e instanceof QueryError) {
          return Fail({
            message: t(e.message),
            errors: e.errors,
            code: e.code,
          });
        }
        throw e;
      }
    },
    async updateApplicationSettings(
      _parent,
      { input: { id, ...values } },
      { dataSources, t, currentUser },
    ) {
      try {
        const application = await dataSources.applicationSettings.update({
          where: { id, userId: currentUser.id },
          data: values,
        });

        return Success({
          application,
          code: APPLICATION_UPDATED,
          message: t(APPLICATION_UPDATED),
        });
      } catch (e) {
        if (e instanceof QueryError) {
          return Fail({
            message: t(e.message),
            errors: e.errors,
            code: e.code,
          });
        }
        throw e;
      }
    },
    async deleteApplicationSettings(_parent, { id }, { dataSources, t, cache, currentUser }) {
      try {
        await dataSources.applicationSettings.destroy({
          where: { id, userId: currentUser.id },
        });

        await cache.remove(CLIENTS_CACHE_KEY);

        return Success({
          id,
          code: APPLICATION_DELETED,
          message: t(APPLICATION_DELETED),
        });
      } catch (e) {
        if (e instanceof QueryError) {
          return Fail({
            message: t(e.message),
            errors: e.errors,
            code: e.code,
          });
        }
        throw e;
      }
    },
  },
};
