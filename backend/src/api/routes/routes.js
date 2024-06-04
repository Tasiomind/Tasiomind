import verifyClient from '~api/middleware/verifyClient';
import wellKnownRouter from './well-known';
import authRouter from './auth';

const router = async (express, app, server) => {
  // app.all("/graphql", expressMiddleware(await server));
  // app.use(verifyClient);
  app.get('/ip', (request, response) => response.send(request.ip));

  app.use('/auth', authRouter);
  app.use('/.well-known', wellKnownRouter);
};

export default router;
