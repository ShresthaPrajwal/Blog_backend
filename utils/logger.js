const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.simple(),
  transports: [new winston.transports.File({ filename: './log/application.log' })],
});

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
  logger,
};
