import { GraphQLError, defaultFieldResolver } from 'graphql';
import { INVALID_CLIENT_ID } from '~helpers/constants/responseCodes';

export default (req, res, next) => {
  const {
    context: { clientId, clients },
  } = req;

  if (!clientId) {
    return next(new GraphQLError('clientId is missing in the request context'));
  }

  if (!clients) {
    console.error('clients list is missing in the request context');
    return next(new GraphQLError('clients list is missing in the request context'));
  }

  if (!clients.includes(clientId)) {
    console.error(`Invalid client ID: ${clientId}`, clients);
    return next(new GraphQLError(INVALID_CLIENT_ID));
  }

  return next();
};
