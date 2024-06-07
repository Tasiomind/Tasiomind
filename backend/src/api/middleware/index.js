import Sentry from '~services/sentry';
import verifyClient from '~api/middleware/verifyClient';
import errorHandler from './errorHandler';
import apiLimiter from './apiLimiter';
import contextMiddleware from './context';
import helmet from './helmet';
import session from './session';
import cors from './cors';

export default async (express, app) => {
  helmet(app);
  session(app);
  cors(app);
  app.use(verifyClient);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '50mb' }));
  app.set('trust proxy', true);
  app.disable('x-powered-by');
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
  app.use(errorHandler);
  app.use(apiLimiter);
  app.use(contextMiddleware);
  app.use((req, res, next) => {
    if (!req.timedout) next();
  });
};
