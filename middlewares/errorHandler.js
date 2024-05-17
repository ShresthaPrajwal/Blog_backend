const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const logger = require('../utils/logger');

const errorHandler = (error, request, response, next) => {
  logger.error(
    `${error.status || 500} - ${error.message} - ${request.originalUrl} - ${request.method} - ${request.ip}`,
  );
  // console.error(
  //   'From Error Handler',
  //   error.message,
  //   error.status,
  //   error.name,
  //   error.stack,
  // );
  const errorId = uuidv4();
  const timestamp = new Date().toISOString();
  if (!error.status) {
    let code;
    switch (error.name) {
      case 'CastError':
        code = 400;
        break;
      case 'ValidationError':
        code = 422;
        break;
      case 'JsonWebTokenError':
        code = 401;
        break;
      case 'TokenExpiredError':
        code = 401;
        break;
      case 'DocumentNotFoundError':
        code = 404;
        break;
      default:
        code = 500;
    }
    error.status = code;
  }
  if (config.NODE_ENV === 'development') {
    response.status(error.status).json({
      errorId,
      message: error.message,
      stack: error.stack,
      success: false,
      timestamp,
    });
  } else {
    response.status(error.status).json({
      errorId,
      message: error.message,
      success: false,
      timestamp,
    });
  }
  next();
};

module.exports = errorHandler;
