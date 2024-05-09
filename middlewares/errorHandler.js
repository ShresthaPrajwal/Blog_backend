const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const { logger } = require('../utils/logger');

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  console.error(error.message);
  const errorId = uuidv4();

  if (config.NODE_ENV === 'development') {
    res.status(error.status || 500).json({
      errorId,
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(error.status || 500).json({
      errorId,
      message: error.message,
    });
  }
  next();
};

module.exports = errorHandler;
