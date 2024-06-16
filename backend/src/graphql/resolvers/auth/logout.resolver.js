import analytics from '~services/analytics';
import { Fail, Success } from '~helpers/response';
import { LOGGED_OUT } from '~helpers/constants/responseCodes';
import { deleteAllCookies } from '~utils/cookieManager';

export default {
  Mutation: {
    async logout(_parent, { all }, { cache, t, accessToken, jwt, req, res, clientId, clients }) {
      try {
        const { sub } = jwt.decode(accessToken);

        if (all) {
          await Promise.all(clients.map(cid => cache.remove(`${cid}:${sub}`)));
        } else {
          await cache.remove(`${clientId}:${sub}`);
        }

        analytics.track({
          userId: sub,
          event: 'Logged Out',
        });

        deleteAllCookies(req, res);
        return Success({
          message: t(LOGGED_OUT),
          code: LOGGED_OUT,
        });
      } catch (error) {
        return Fail({
          message: error.message,
        });
      }
    },
  },
};
