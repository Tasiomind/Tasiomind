import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { appConfig } from '@appConfig';
import { encryptLocalIV } from '@/plugins/crypto';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';

const clientID = encryptLocalIV('f078d36a-b15a-4387-a0e3-726b7e48b777').data;
const serverSideVersion = encryptLocalIV('1.0.0').data;

export const createApolloClient = ({
  clientId = clientID,
  ssv = serverSideVersion,
  httpEndpoint = '/graphql',
  wsEndpoint = null,
  tokenName = 'authToken',
  persisting = false,
  ssr = true,
  websocketsOnly = false,
  link = null,
  preAuthLinks = [],
  defaultHttpLink = true,
  httpLinkOptions = { credentials: 'same-origin' },
  cache = null,
  inMemoryCacheOptions = {},
  apollo = {},
  clientState = null,
  typeDefs = undefined,
  resolvers = undefined,
  onCacheInit = undefined,
} = {}) => {
  let wsClient;
  const disableHttp = websocketsOnly && !ssr && wsEndpoint;

  // Initialize Apollo cache
  cache = cache || new InMemoryCache(inMemoryCacheOptions);

  // Create HTTP link if not disabled
  const httpLink = !disableHttp && new HttpLink({ uri: httpEndpoint, ...httpLinkOptions });

  // Create Auth link
  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      'client_id': clientID,
      'ssv': ssv,
      ...headers,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  }));

  // Concatenate all HTTP link parts
  if (!disableHttp) {
    if (!link) {
      link = httpLink;
    } else if (defaultHttpLink) {
      link = from([link, httpLink]);
    }
    link = from([authLink, ...preAuthLinks, link]);
  }

  if (!ssr) {
    // Restore Apollo state from the window object if available
    if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
      const state = window.__APOLLO_STATE__[clientId];
      if (state) {
        cache.restore(state);
      }
    }

    // Add persisted query link if persisting is enabled
    if (!disableHttp && persisting) {
      link = createPersistedQueryLink(typeof persisting === 'object' ? persisting : {}).concat(
        link,
      );
    }

    // Create WebSocket link if endpoint is provided
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

  // Create Apollo Client
  const apolloClient = new ApolloClient({
    link,
    cache,
    ...(ssr ? { ssrMode: true } : { ssrForceFetchDelay: 100, connectToDevTools: false }),
    typeDefs,
    resolvers,
    ...apollo,
  });

  // Handle client state
  if (clientState) {
    apolloClient.onResetStore(clientState.writeDefaults);
  }

  // Initialize cache if function provided
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
