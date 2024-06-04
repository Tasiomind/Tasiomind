const helmet = require("helmet");

module.exports = (app) => {
  // adding Helmet to enhance your API's security
  // app.use(helmet()); //is a function that adds various HTTP headers to the response of an Express application.
  // It helps protect against common web vulnerabilities by setting HTTP headers appropriately. The headers set by helmet() include:
  // • X-XSS-Protection - sets the X-XSS-Protection header to prevent cross-site scripting attacks
  // • X-Frame-Options - sets the X-Frame-Options header to prevent clickjacking attacks
  // • Strict-Transport-Security - sets the Strict-Transport-Security header to enforce secure (HTTPS) connections
  // • Content Security Policy - sets the Content Security Policy header to prevent cross site scripting and other attacks
  //-------------------------------------------------------
  // This code uses the helmet.contentSecurityPolicy() middleware to set up a Content Security Policy (CSP) for an application.
  //  The CSP is configured to allow resources from the same origin('self') for all resource types, as well as 'unsafe-inline' styles and data: fonts.All other sources are blocked('none').
  app.use(
    helmet.contentSecurityPolicy({
      defaultSrc: [`'none'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      scriptSrc: [`'self'`],
      imgSrc: [`'self'`],
      connectSrc: [`'self'`],
      frameSrc: [`'self'`],
      fontSrc: [`'self'`, "data:"],
      objectSrc: [`'self'`],
      mediaSrc: [`'self'`],
    })
  );
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.hsts());
  app.use(helmet.xssFilter());
  // This code uses the helmet.hidePoweredBy() middleware to remove the X-Powered-By header from the response.
  app.use(helmet.hidePoweredBy());
  app.use(
    helmet.hsts({
      maxAge: 86400, // 1 days
    })
  );
};
