import * as Sentry from '@sentry/node';
import config from 'config/app.config';

import '@sentry/tracing';

const sentryConfig = {
  dsn: config.sentry.dsn,
  environment: config.appStatus,
  enabled: config.sentry.enabled,
  tracesSampleRate: config.sentry.tracesSampleRate,
  // integrations: [
  //   new Http({ tracing: true }),
  //   new Sentry.Integrations.OnUncaughtException(),
  //   new Sentry.Integrations.OnUnhandledRejection(),
  // ],
};

Sentry.init(sentryConfig);

export default Sentry;
