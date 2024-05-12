const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const { logger } = require('../utils/logger');

const errorHandler = (error, request, response, next) => {
  logger.error(error.status, error.message);
  console.error(error.message);
  const errorId = uuidv4();
  const timestamp = new Date().toISOString();

  if (config.NODE_ENV === 'development') {
    response.status(error.status || 500).json({
      errorId,
      message: error.message,
      stack: error.stack,
      success: false,
      timestamp,
    });
  } else {
    response.status(error.status || 500).json({
      errorId,
      message: error.message,
      success: false,
      timestamp,
    });
  }
  next();
};

module.exports = errorHandler;
