import { ApolloClient, HttpLink } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { setContext } from '@apollo/client/link/context';
import { appConfig } from '@appConfig';

// import { split, from } from '@apollo/client/link';
// import { createUploadLink } from 'apollo-upload-client';
// import { SubscriptionClient } from 'subscriptions-transport-ws';
// import MessageTypes from 'subscriptions-transport-ws/dist/message-types';
// import { WebSocketLink } from 'apollo-link-ws';
// import { getMainDefinition } from 'apollo-utilities';
// import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
// import { withClientState } from 'apollo-link-state';

// Create the apollo client
export const createApolloClient = ({
  // Client ID if using multiple Clients
  clientId = appConfig.clientID.value,
  // URL to the HTTP API
  httpEndpoint,
  // Url to the Websocket API
  wsEndpoint = null,
  // Token used in localstorage
  tokenName = 'apollo-token',
  // Enable this if you use Query persisting with Apollo Engine
  persisting = false,
  // Is currently Server-Side Rendering or not
  ssr = false,
  // Only use Websocket for all requests (including queries and mutations)
  websocketsOnly = false,
  // Custom starting link.
  // If you want to replace the default HttpLink, set `defaultHttpLink` to false
  link = null,
  // Custom pre-auth links
  // Useful if you want, for example, to set a custom middleware for refreshing an access token.
  preAuthLinks = [],
  // If true, add the default HttpLink.
  // Disable it if you want to replace it with a terminating link using `link` option.
  defaultHttpLink = true,
  // Options for the default HttpLink
  httpLinkOptions = {},
  // Custom Apollo cache implementation (default is apollo-cache-inmemory)
  cache = null,
  // Options for the default cache
  inMemoryCacheOptions = {},
  // Additional Apollo client options
  apollo = {},
  // apollo-link-state options
  clientState = null,
  // Function returning Authorization header token
  getAuth = defaultGetAuth,
  // Local Schema
  typeDefs = undefined,
  // Local Resolvers
  resolvers = undefined,
  // Hook called when you should write local state in the cache
  onCacheInit = undefined,
}) => {
  let wsClient, authLink, stateLink;
  const disableHttp = websocketsOnly && !ssr && wsEndpoint;

  // Apollo cache
  if (!cache) {
    cache = new InMemoryCache(inMemoryCacheOptions);
  }

  if (!disableHttp) {
    const httpLink = new HttpLink({
      uri: httpEndpoint,
      ...httpLinkOptions,
    });

    if (!link) {
      link = httpLink;
    } else if (defaultHttpLink) {
      link = from([link, httpLink]);
    }

    // HTTP Auth header injection
    authLink = setContext(async (_, { headers }) => {
      const Authorization = await getAuth(tokenName);
      const authorizationHeader = Authorization ? { Authorization } : {};

      return {
        headers: {
          client_id: 'f078d36a-b15a-4387-a0e3-726b7e48b777',
          ...headers,
          ...authorizationHeader,
        },
      };
    });

    // Concat all the http link parts
    link = authLink.concat(link);

    if (preAuthLinks.length) {
      link = from(preAuthLinks).concat(authLink);
    }
  }

  // On the server, we don't want WebSockets and Upload links
  if (!ssr) {
    // If on the client, recover the injected state
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-underscore-dangle
      const state = window.__APOLLO_STATE__;
      if (state && state[clientId]) {
        // Restore state
        cache.restore(state[clientId]);
      }
    }

    if (!disableHttp) {
      let persistingOpts = {};
      if (typeof persisting === 'object' && persisting != null) {
        persistingOpts = persisting;
        persisting = true;
      }
      if (persisting === true) {
        link = createPersistedQueryLink(persistingOpts).concat(link);
      }
    }

    // Web socket
    if (wsEndpoint) {
      wsClient = new SubscriptionClient(wsEndpoint, {
        reconnect: true,
        connectionParams: () => {
          const Authorization = getAuth(tokenName);
          return Authorization ? { Authorization, headers: { Authorization } } : {};
        },
      });

      // Create the subscription websocket link
      const wsLink = new WebSocketLink(wsClient);

      if (disableHttp) {
        link = link ? link.concat(wsLink) : wsLink;
      } else {
        link = split(
          // split based on operation type
          ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
          },
          wsLink,
          link,
        );
      }
    }
  }

  if (clientState) {
    console.warn(
      'clientState is deprecated, see https://vue-cli-plugin-apollo.netlify.com/guide/client-state.html',
    );
    stateLink = withClientState({
      cache,
      ...clientState,
    });
    link = from([stateLink, link]);
  }

  const apolloClient = new ApolloClient({
    link,
    cache,
    // Additional options
    ...(ssr
      ? {
          // Set this on the server to optimize queries when SSR
          ssrMode: true,
        }
      : {
          // This will temporary disable query force-fetching
          ssrForceFetchDelay: 100,
          // Apollo devtools
          connectToDevTools: process.env.NODE_ENV !== 'production',
        }),
    typeDefs,
    resolvers,
    ...apollo,
  });

  // Re-write the client state defaults on cache reset
  if (stateLink) {
    apolloClient.onResetStore(stateLink.writeDefaults);
  }

  if (onCacheInit) {
    onCacheInit(cache);
    apolloClient.onResetStore(() => onCacheInit(cache));
  }

  return {
    apolloClient,
    wsClient,
    stateLink,
  };
};

export const restartWebsockets = wsClient => {
  // Copy current operations
  const operations = Object.assign({}, wsClient.operations);

  // Close connection
  wsClient.close(true);

  // Open a new one
  wsClient.connect();

  // Push all current operations to the new connection
  Object.keys(operations).forEach(id => {
    wsClient.sendMessage(id, MessageTypes.GQL_START, operations[id].options);
  });
};

const defaultGetAuth = tokenName => {
  if (typeof window !== 'undefined') {
    // get the authentication token from local storage if it exists
    const token = window.localStorage.getItem(tokenName);
    // return the headers to the context so httpLink can read them
    return token ? `Bearer ${token}` : '';
  }
};
