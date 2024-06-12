import helmet from 'helmet';

export default app => {
  const cspConfig = {
    directives: {
      defaultSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'self'"],
      mediaSrc: ["'self'"],
    },
  };

  app.use(
    helmet({
      contentSecurityPolicy: cspConfig,
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' },
      ieNoOpen: true,
      noSniff: true,
      permittedCrossDomainPolicies: true,
      referrerPolicy: { policy: 'no-referrer' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      xssFilter: true,
      hidePoweredBy: true,
    }),
  );
};
