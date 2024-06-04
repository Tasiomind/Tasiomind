const bodyParser = require("body-parser");

module.exports = (app) => {
  // using bodyParser to parse JSON bodies into JS objects
  app.use(bodyParser.json());
  /*
   Use cookieParser and session middlewares together.
   By default Express/Connect app creates a cookie by name 'connect.sid'.But to scale Socket.io app,
   make sure to use cookie name 'jsessionid' (instead of connect.sid) use Cloud Foundry's 'Sticky Session' feature.
   W/o this, Socket.io won't work if you have more than 1 instance.
   If you are NOT running on Cloud Foundry, having cookie name 'jsessionid' doesn't hurt - it's just a cookie name.
   */
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
};
