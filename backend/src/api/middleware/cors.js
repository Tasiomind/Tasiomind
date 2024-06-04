import cors from "cors";

const config = require("config/app.config");

export default (app) => {
  //setting CSP
  /* This is a middleware that is used to parse the body of the request. */
  // enabling CORS for all requests
  const corsOptionsDelegate = (req, callback) => {
    const corsOptions = {
      origin: config.allowlist.includes(req.header("Origin")) ? true : false,
    };
    callback(null, corsOptions);
  };

  app.use(
    cors({
      origin: true,
      // origin: corsOptionsDelegate,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // enable set cookie
      optionsSuccessStatus: 200,
      credentials: true,
      maxAge: 86400, // 1 days
    })
  );
};
