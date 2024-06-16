import { createServer } from '~utils/http/http';
import os from 'node:os';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLError } from 'graphql';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { INVALID_CLIENT_ID } from '~helpers/constants/responseCodes';

import logger from '~utils/logger';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

import dataSources from './datasources';
import applyDirectives from './directives';

import errorPlugin from './plugins/errorPlugin';

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
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), errorPlugin],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    logger,
    cache: 'bounded',
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

  await server.start().then(async () => {
    console.log(`Apollo server started at https://${os.hostname()}/${server.graphqlPath}`);
  });
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const { t, context } = req;
        if (!context.clients.includes(context.clientId)) {
          throw new GraphQLError(INVALID_CLIENT_ID);
        }
        return { t, ...context, dataSources, res };
      },
    }),
  );

  return server;
};

export const startApolloServer = async app => {
  const httpServer = await createServer(app);
  const server = await createApolloServer(app, httpServer);
  return server;
};
