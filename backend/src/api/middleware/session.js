const session = require('express-session');

const { uuidv4 } = require('../../utils/uuid');
const SESSION_SECRET = uuidv4();

module.exports = app => {
  // Sessions allow us to Contact data on visitors from request to request
  // This keeps admins logged in and allows us to send flash messages
  // store: new FileStore(),
  app.use(
    session({
      name: 'session_id',
      saveUninitialized: true,
      resave: false,
      rolling: false,
      secret: SESSION_SECRET,
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none',
        secure: true,
        HostOnly: true,
      },
    }),
  );
};
