import Sentry from "~services/sentry";
import errorHandler from "./errorHandler";
import apiLimiter from "./apiLimiter";
import contextMiddleware from "./context";
import helmet from "./helmet";
import session from "./session";
import cors from "./cors";

export default async (express, app) => {
  // Body-Parser Middleware für JSON-Anfragen
  app.use(express.json({ limit: "50mb" }));

  // Vertraue dem ersten Proxy
  // app.set("trust proxy", true);

  // Deaktiviere 'X-Powered-By'-Header
  app.disable("x-powered-by");

  // Helmet-Middleware für Sicherheitskopfzeilen
  helmet(app);

  // Session-Middleware
  session(app);

  // CORS-Middleware für Cross-Origin Resource Sharing
  cors(app);

  // Sentry Request Handler
  app.use(Sentry.Handlers.requestHandler());

  // Eigene Fehlerbehandlung
  app.use(errorHandler);

  // API-Ratenbegrenzung (auskommentiert, falls nicht benötigt)
  app.use(apiLimiter);

  // Kontext-Middleware (auskommentiert, falls nicht benötigt)
  app.use(contextMiddleware);

  // Routen hier hinzufügen, etc.

  // Middleware zur Überprüfung auf Timeout
  const haltOnTimedout = (req, res, next) => {
    if (!req.timedout) next();
  };
  app.use(haltOnTimedout);

  // Body-Parser Middleware für URL-kodierte Daten
  app.use(express.urlencoded({ extended: true }));
};
