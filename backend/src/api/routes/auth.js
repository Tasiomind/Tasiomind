import express from 'express';
import timeout from 'connect-timeout';
import passport from 'passport';
import AuthController from '../controllers/auth';

const router = express.Router();

router.post('/refresh_token', timeout('45s'), AuthController.refreshToken);
router.get('/', passport.authenticate('oauth2'));
router.get(
  '/callback',
  passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
);

export default router;
