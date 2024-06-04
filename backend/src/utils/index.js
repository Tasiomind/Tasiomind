import { createServer } from '~utils/http/http';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { INVALID_CLIENT_ID } from '~helpers/constants/responseCodes';

import logger from '~utils/logger';

import typeDefs from '../graphql/typeDefs';
import resolvers from '../graphql/resolvers';

import dataSources from '../graphql/datasources';
import applyDirectives from '../graphql/directives';

import errorPlugin from '../graphql/plugins/errorPlugin';

const createSchema = () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  return applyDirectives(schema);
};
export const createApolloServer = async (app, httpServer) => {
  const server = new ApolloServer({
    schema: createSchema(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), errorPlugin],
    logger,
    dataSources,
    cache: 'bounded',
    context: ({ req: { t, context } }) => {
      if (!context.clients.includes(context.clientId)) {
        throw new AuthenticationError(INVALID_CLIENT_ID);
      }
      return { t, ...context };
    },
    introspection: true,
    csrfPrevention: true,
    playground: {
      settings: {
        'schema.polling.enable': false,
        'editor.fontSize': 18,
      },
    },
    status400ForVariableCoercionErrors: true,
  });

  return server;
};

export const startApolloServer = async app => {
  const httpServer = await createServer(app);
  const server = await createApolloServer(app, httpServer);

  await server.start().then(async () => {
    console.log('Apollo server started', server.graphqlPath);
  });

  server.applyMiddleware({ app });
  return server;
};
