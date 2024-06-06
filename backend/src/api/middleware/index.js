import Sentry from '~services/sentry';
import errorHandler from './errorHandler';
import apiLimiter from './apiLimiter';
import contextMiddleware from './context';
import helmet from './helmet';
import session from './session';
import cors from './cors';
import passport from 'passport';
import fs from 'fs';

const OAuth2Strategy = require('passport-oauth2').Strategy;
import { uuidv4 } from '~utils/uuid';

export default async (express, app) => {
  app.use(express.json({ limit: '50mb' }));

  // app.set("trust proxy", true);

  app.disable('x-powered-by');

  helmet(app);

  session(app);

  cors(app);

  app.use(Sentry.Handlers.requestHandler());

  app.use(errorHandler);

  app.use(apiLimiter);

  app.use(contextMiddleware);

  // app.use(passport.initialize());

  // const createAuth2Strategy = async () => {
  //   const clientSecret = fs.readFileSync('./config/certificates/public.pem', 'utf8');
  //   const clientID = uuidv4();
  //   const option = {
  //     authorizationURL: 'https://example.com/oauth2/authorize',
  //     tokenURL: 'https://example.com/oauth2/token',
  //     clientID: clientID,
  //     clientSecret: clientSecret,
  //     callbackURL: 'https://localhost:3000/auth/callback',
  //   };
  //   passport.use(
  //     new OAuth2Strategy(option, (accessToken, refreshToken, profile, cb) => {
  //       cb(null, { accessToken, profile });
  //     }),
  //   );
  // };
  // createAuth2Strategy();

  const haltOnTimedout = (req, res, next) => {
    if (!req.timedout) next();
  };
  app.use(haltOnTimedout);

  app.use(express.urlencoded({ extended: true }));
};
