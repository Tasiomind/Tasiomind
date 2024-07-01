import * as Sentry from '@sentry/node';
import config from 'config/app.config';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import '@sentry/tracing';

const sentryConfig = {
  ...config.sentry,

  integrations: [
    nodeProfilingIntegration(),
    //   new Http({ tracing: true }),
    //   new Sentry.Integrations.OnUncaughtException(),
    //   new Sentry.Integrations.OnUnhandledRejection(),
  ],
};

Sentry.init(sentryConfig);

export default Sentry;
