import * as Sentry from "@sentry/node";
import config from "config/app.config";
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

// Importing @sentry/tracing patches the global hub for tracing to work.
import "@sentry/tracing";

const sentryConfig = {
  dsn: config.sentry.dsn,
  environment: config.appStatus,
  enabled: config.sentry.enabled,
  tracesSampleRate: config.sentry.tracesSampleRate,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection(),
  ],
};

Sentry.init(sentryConfig);

export default Sentry;
