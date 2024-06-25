import db from '~db/models';
import * as jwt from '~utils/jwt';
import otp from '~utils/otp';
import log from '~utils/logger';
import cache from '~utils/cache';
import mailer from '~utils/mailer';
import storage from '~utils/storage';
import analytics from '~services/analytics';
import Sentry from '~services/sentry';
import getUser from '~utils/getUser';
import TokenError from '~utils/errors/TokenError';
import { CLIENTS_CACHE_KEY } from '~helpers/constants/auth';
import { decryptLocalIV } from '~utils/crypto';
import { getDecryptedCookie } from '~utils/cookieManager';
import config from 'config/app.config';

const contextMiddleware = async (req, res, next) => {
  const { client_id: encryptedClientId, version } = req.headers;
  const accessToken = getDecryptedCookie(req, 'accessToken');
  const clientId = decryptLocalIV(encryptedClientId);
  let tokenInfo;
  let sessionId;
  let currentUser;
  let isRootUser = false;
  let isAdmin = false;
  let clients = await cache.getJSON(CLIENTS_CACHE_KEY);
  const apps = await db.Application.findAll();
  clients = apps.map(app => app.clientID);

  if (version === undefined || version === config.version)
    return res.status(400).json({ message: 'version not supported any more' });

  if (!clients) {
    await cache.setJSON(CLIENTS_CACHE_KEY, clients, '365 days');
  }

  if (accessToken) {
    try {
      tokenInfo = jwt.verify(accessToken, { clientId });
      sessionId = await cache.get(`${clientId}:${tokenInfo.sub}`);

      currentUser = await getUser(tokenInfo.sub);
      if (currentUser) {
        isRootUser = currentUser.hasRole(['root']);
        isAdmin = currentUser.hasRole(['admin']);

        analytics.identify({
          userId: currentUser.id,
          traits: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            locale: currentUser.locale,
          },
        });
        Sentry.setUser({
          id: currentUser.id,
          email: currentUser.email,
        });
        if (currentUser.locale) {
          await req.i18n.changeLanguage(currentUser.locale);
        }
      }
    } catch (err) {
      if (!(err instanceof TokenError)) {
        Sentry.captureException(err);
      }
      log.warn({ err });
    }
  }

  req.context = {
    db,
    otp,
    cookie: res.cookie,
    jwt,
    req,
    res,
    cache,
    isAdmin,
    isRootUser,
    storage,
    tokenInfo,
    sessionId,
    clientId,
    clients,
    mailer,
    accessToken,
    currentUser,
    locale: currentUser?.locale || req.language,
  };
  return next();
};

export default contextMiddleware;
