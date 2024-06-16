import Sentry from '~services/sentry';
import verifyClient from '~api/middleware/verifyClient';
import errorHandler from './errorHandler';
import apiLimiter from './apiLimiter';
import bodyParser from './bodyParser';
import contextMiddleware from './context';
import helmet from './helmet';
import session from './session';
import cors from 'cors';
import config from 'config/app.config';
import cookieParser from 'cookie-parser';

export default async (express, app) => {
  app.set('trust proxy', 'loopback');
  app.disable('x-powered-by');
  bodyParser(express, app);
  helmet(app);
  session(app);
  app.use(cookieParser());
  app.use(cors(config.cors));
  // app.use(Sentry.Handlers.requestHandler());
  // app.use(Sentry.Handlers.errorHandler());
  app.use(apiLimiter);
  // app.use(errorHandler);
  app.use(contextMiddleware);
  app.use(verifyClient);
};
