const jwt = require('jsonwebtoken');
const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (request, response, next) => {
  let token;
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.replace('Bearer ', '');
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      request.user = decodedToken;
      console.log(decodedToken);
    } catch (error) {
      return response.status(401).json({ error: 'Invalid token' });
    }
  } else {
    token = null;
  }
  request.token = token;
  next();
};

const unknownEndpoints = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  unknownEndpoints,
  errorHandler,
};
