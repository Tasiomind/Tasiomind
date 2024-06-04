// Components
import App from '@/App.vue';
import { createApp, h, provide } from 'vue';
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable';

// styles
import '@/styles/index.scss';
import '@/styles/user-custom/style.scss';

// Plugins
import 'vue3-toastify/dist/index.css';
import { registerPlugins } from '@/plugins/vuetify/index';

// Apollo
import { createApolloClient } from '@/plugins/apollo';

const { apolloClient } = createApolloClient({
  httpEndpoint: '/graphql',
});

const app = createApp({
  setup() {
    provideApolloClient(apolloClient);
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

registerPlugins(app);

app.mount('#app');
