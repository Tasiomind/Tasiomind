import session from 'express-session';
import { createSessionSecret } from '~utils/crypto';

const SESSION_SECRET = createSessionSecret();

export default app => {
  app.use(
    session({
      name: 'UUID',
      saveUninitialized: true,
      resave: false,
      rolling: false,
      secret: SESSION_SECRET,
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'Lax',
        secure: true,
        HostOnly: true,
      },
    }),
  );
};
