import jwt, { NotBeforeError, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import {
  TOKEN_EXPIRED_ERROR,
  TOKEN_INVALID_ERROR,
  TOKEN_NOT_BEFORE_ERROR,
} from '~helpers/constants/responseCodes';
import { FACEBOOK_PROVIDER, GOOGLE_PROVIDER } from '~helpers/constants/auth';
import TokenError from '../errors/TokenError';
import config from 'config/app.config';
import { readSSLKeys } from '~utils/ssl';

const verify = async (token, { clientId, ...options } = {}) => {
  const ssl = await readSSLKeys();
  const publicKey = ssl.cert;

  try {
    return jwt.verify(token, publicKey, {
      ...options,
      issuer: hostname,
      audience: clientId,
    });
  } catch (e) {
    if (e instanceof NotBeforeError) {
      throw new TokenError(TOKEN_NOT_BEFORE_ERROR, e);
    } else if (e instanceof TokenExpiredError) {
      throw new TokenError(TOKEN_EXPIRED_ERROR, e);
    } else if (e instanceof JsonWebTokenError) {
      throw new TokenError(TOKEN_INVALID_ERROR, e);
    } else {
      throw e;
    }
  }
};

const verifySocialToken = async ({ provider, token }) => {
  let userInfo;
  switch (provider) {
    case GOOGLE_PROVIDER:
      userInfo = await verifyGoogleToken(token);
      break;
    case FACEBOOK_PROVIDER:
      userInfo = await verifyFacebookToken(token);
      break;
    default:
      break;
  }

  return userInfo;
};

export default {
  verify,
  verifySocialToken,
};
