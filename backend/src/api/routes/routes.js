import express from 'express';
import morgan from 'morgan';
import wellKnownRouter from './well-known';
import authRouter from './auth';
// import userRouter from './user';
import cryptoRouter from './crypto';

const router = async (express, app, server) => {
  app.use(morgan('combined'));
  app.get('/ip', (req, res) => res.send(req.ip));
  app.use('/auth', authRouter);
  // app.use('/user', auth(), userRouter);
  app.use('/.well-known', wellKnownRouter);
  app.use('/crypto', cryptoRouter);
};

export default router;
