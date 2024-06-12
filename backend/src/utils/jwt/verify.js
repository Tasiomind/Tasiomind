import fs from 'fs';
import jwt, { NotBeforeError, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import {
  TOKEN_EXPIRED_ERROR,
  TOKEN_INVALID_ERROR,
  TOKEN_NOT_BEFORE_ERROR,
} from '~helpers/constants/responseCodes';
import TokenError from '../errors/TokenError';
import config from 'config/app.config';

export const verify = (token, { clientId, ...options } = {}) => {
  const publicKey = fs.readFileSync('./config/certificates/public.pem');

  try {
    return jwt.verify(token, publicKey, {
      ...options,
      issuer: config.hostname,
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
