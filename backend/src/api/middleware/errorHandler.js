const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require("@apollo/server/plugin/drainHttpServer");
const TokenError = require("../../utils/errors/TokenError");
const analytics = require("../../services/analytics");
const log = require("../../utils/logger");
const {
  SOMETHING_WENT_WRONG,
} = require("../../helpers/constants/responseCodes");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  analytics.flush();
  let statusCode;
  let { message } = err;
  if (err instanceof UserInputError) {
    statusCode = 400;
  } else if (err instanceof AuthenticationError || err instanceof TokenError) {
    statusCode = 401;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
  } else {
    statusCode = 500;
    message = SOMETHING_WENT_WRONG;
  }

  log.error({ err });

  res
    .status(statusCode)
    .json({
      success: false,
      message: req.t(message),
    })
    .end();
};

module.exports = errorHandler;
