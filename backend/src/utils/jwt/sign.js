import fs from 'fs';
import jwt from 'jsonwebtoken';
import { nanoid } from '~utils/uuid';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '~helpers/constants/auth';
import config from 'config/app.config';

export const sign = (payload, expiresIn = '15m') => {
  const privateKey = fs.readFileSync('./config/certificates/private.pem');

  const id = nanoid();
  const token = jwt.sign(payload, privateKey, {
    jwtid: id,
    expiresIn,
    issuer: config.server.hostname,
    algorithm: 'RS256',
  });

  return { token, id };
};

export const generateToken = (payload = {}, expiresIn = '5 minutes') => {
  const { token, id } = sign(payload, expiresIn);

  return { token, exp: expiresIn, id };
};

export const getAuthTokens = async (
  sub,
  { tokenExp = ACCESS_TOKEN_EXPIRES_IN, refreshTokenExp = REFRESH_TOKEN_EXPIRES_IN, clientId: aud },
) => {
  const refreshToken = generateToken({ aud }, refreshTokenExp);
  const accessToken = generateToken({ sub, aud, sid: refreshToken.id }, tokenExp);

  return {
    accessToken: accessToken.token,
    refreshToken: refreshToken.token,
    sid: refreshToken.id,
    exp: refreshToken.exp,
  };
};
