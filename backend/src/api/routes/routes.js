import express from 'express';
import morgan from 'morgan';
import wellKnownRouter from './well-known';
import authRouter from './auth';
// import userRouter from './user';
// import { generateOTP } from '~services/OTPAuth';
import * as OTPAuth from 'otpauth';
import config from 'config/app.config';

const router = async (express, app, server) => {
  app.use(morgan('combined'));
  // app.get('/ip', (req, res) => res.send(req.ip));
  // app.use('/auth', authRouter);
  // // app.use('/user', auth(), userRouter);
  // app.use('/.well-known', wellKnownRouter);
  app.post('/otp/generate', (req, res) => {
    const base32_secret = 'JBSWY3DPEHPK3PXP';

    let totp = new OTPAuth.TOTP({
      issuer: 'config.appName',
      label: 'config.appName',
      algorithm: 'SHA1',
      digits: 6,
      secret: base32_secret,
    });

    let otpauth_url = totp.toString();

    res.status(200).json({
      base32: base32_secret,
      otpauth_url,
    });
  });
  // app.post('/otp/verify', authController.VerifyOTP);
  // app.post('/otp/validate', authController.ValidateOTP);
  // app.post('/otp/disable', authController.DisableOTP);
};

export default router;
