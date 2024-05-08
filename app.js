const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const swaggerSetup = require('./config/swagger')


const app = express();

mongoose.set('strictQuery', false);

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error Connecting to MongoDB', error.message);
  });


app.use(express.static('/upload'));
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

swaggerSetup(app)

app.use('/api', require('./routers/index'));//declare top
// app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoints);
app.use(middleware.errorHandler);

module.exports = app;
