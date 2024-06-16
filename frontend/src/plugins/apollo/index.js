import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { appConfig } from '@appConfig';
import { encryptLocalIV } from '@/plugins/crypto';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';

const clientID = encryptLocalIV('f078d36a-b15a-4387-a0e3-726b7e48b777');

export const createApolloClient = ({
  clientId = clientID,
  httpEndpoint = '/graphql',
  wsEndpoint = '/graphqlWs',
  tokenName = 'authToken',
  persisting = false,
  ssr = true,
  websocketsOnly = false,
  link = null,
  preAuthLinks = [],
  defaultHttpLink = true,
  httpLinkOptions = {
    credentials: 'same-origin',
  },
  cache = null,
  inMemoryCacheOptions = {},
  apollo = {},
  clientState = null,
  typeDefs = undefined,
  resolvers = undefined,
  onCacheInit = undefined,
}) => {
  let wsClient;
  const disableHttp = websocketsOnly && !ssr && wsEndpoint;

  // Apollo cache
  if (!cache) {
    cache = new InMemoryCache(inMemoryCacheOptions);
  }

  const httpLink =
    !disableHttp &&
    new HttpLink({
      uri: httpEndpoint,
      ...httpLinkOptions,
    });

  // HTTP Auth header injection
  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      'client_id': clientID.data,
      ...headers,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  }));

  // Concat all the http link parts
  if (!disableHttp) {
    if (!link) {
      link = httpLink;
    } else if (defaultHttpLink) {
      link = from([link, httpLink]);
    }
    link = from([authLink, ...preAuthLinks, link]);
  }

  // On the server, we don't want WebSockets and Upload links
  if (!ssr) {
    if (
      typeof window !== 'undefined' &&
      window.__APOLLO_STATE__ &&
      window.__APOLLO_STATE__[clientId]
    ) {
      cache.restore(window.__APOLLO_STATE__[clientId]);
    }

    if (!disableHttp && persisting) {
      link = createPersistedQueryLink(typeof persisting === 'object' ? persisting : {}).concat(
        link,
      );
    }

    if (wsEndpoint) {
      wsClient = new SubscriptionClient(wsEndpoint, {
        reconnect: true,
        connectionParams: () => {
          const Authorization = localStorage.getItem(tokenName);
          return Authorization ? { Authorization, headers: { Authorization } } : {};
        },
      });

      const wsLink = new WebSocketLink(wsClient);

      link = disableHttp
        ? wsLink
        : split(
            ({ query }) => {
              const { kind, operation } = getMainDefinition(query);
              return kind === 'OperationDefinition' && operation === 'subscription';
            },
            wsLink,
            link,
          );
    }
  }

  const apolloClient = new ApolloClient({
    link,
    cache,
    ...(ssr
      ? { ssrMode: true }
      : {
          ssrForceFetchDelay: 100,
          connectToDevTools: process.env.NODE_ENV !== 'production',
        }),
    typeDefs,
    resolvers,
    ...apollo,
  });

  if (clientState) {
    apolloClient.onResetStore(clientState.writeDefaults);
  }

  if (onCacheInit) {
    onCacheInit(cache);
    apolloClient.onResetStore(() => onCacheInit(cache));
  }

  return { apolloClient, wsClient };
};

export const restartWebsockets = wsClient => {
  const operations = { ...wsClient.operations };
  wsClient.close(true);
  wsClient.connect();
  Object.keys(operations).forEach(id => {
    wsClient.sendMessage(id, 'start', operations[id].options);
  });
};
