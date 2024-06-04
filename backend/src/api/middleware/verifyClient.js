import { AuthenticationError } from 'apollo-server-core';
import { INVALID_CLIENT_ID } from '~helpers/constants/responseCodes';

const verifyClient = (req, _res, next) => {
  const { clientId, clients } = req.context;

  if (!clients.includes(clientId)) {
    return next(new AuthenticationError(INVALID_CLIENT_ID));
  }
  return next();
};

module.exports = verifyClient;
