const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'error', 
  transports: [
    new winstonDailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
});

module.exports = logger;
