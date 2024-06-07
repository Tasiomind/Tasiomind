import express from 'express';
import morgan from 'morgan';
import wellKnownRouter from './well-known';
import authRouter from './auth';
// import userRouter from './user';

const router = async (express, app, server) => {
  app.use(morgan('combined'));
  app.get('/ip', (request, response) => response.send(request.ip));
  app.use('/auth', authRouter);
  // app.use('/user', auth(), userRouter);
  app.use('/.well-known', wellKnownRouter);
};

export default router;
