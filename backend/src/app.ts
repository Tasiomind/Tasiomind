import express, { Express } from 'express';
const app: Express = express();

//-------------------------------------------------------
// || ======== *** Check System *** ========= ||
//-------------------------------------------------------
import './utils/systemInfo/checkSystem';
//-------------------------------------------------------
// || ======== *** Internet Connectivity *** ========= ||
//-------------------------------------------------------
// import "./modules/systemInfo/internetConnectivity";
//-------------------------------------------------------
// || ======== *** LanguageMiddleware *** ========= ||
//-------------------------------------------------------
import i18nConfig from 'config/i18n';
i18nConfig(app);
//-------------------------------------------------------
// || ======== *** Apollo Server *** ========= ||
//-------------------------------------------------------
import { startApolloServer } from './graphql';
const server = startApolloServer(app);
//-------------------------------------------------------
// || ======== *** SECURITY MIDDLEWARE *** ========= ||
//-------------------------------------------------------
import securityMiddleware from './api/middleware/index';
securityMiddleware(express, app, server);
//-------------------------------------------------------
// || ======== *** Routers *** ========= ||
//-------------------------------------------------------
import setupRoutes from './api/routes/routes';
setupRoutes(express, app, server);
//-------------------------------------------------------
// || ======== *** socket *** ========= ||
//-------------------------------------------------------
// import setupSocket from './modules/socket/socket.js';
// setupSocket(app);
//-------------------------------------------------------
// || ======== *** exports *** ========= ||
//-------------------------------------------------------
export default app;
