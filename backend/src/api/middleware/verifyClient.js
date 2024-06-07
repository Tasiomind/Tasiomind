import { AuthenticationError } from 'apollo-server-core';
import { INVALID_CLIENT_ID } from '~helpers/constants/responseCodes';

const verifyClient = (req, res, next) => {
  const {
    context: { clientId, clients },
  } = req;

  console.error(context, 'clientId is missing in the request context');
  if (!clientId) {
    return next(new AuthenticationError('clientId is missing in the request context'));
  }

  if (!clients) {
    console.error('clients list is missing in the request context');
    return next(new AuthenticationError('clients list is missing in the request context'));
  }

  if (!clients.includes(clientId)) {
    console.error(`Invalid client ID: ${clientId}`);
    return next(new AuthenticationError(INVALID_CLIENT_ID));
  }

  return next();
};
export default verifyClient;
