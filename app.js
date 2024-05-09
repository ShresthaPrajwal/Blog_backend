const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./utils/logger');
const middleware = require('./middlewares/middleware');
const swaggerSetup = require('./config/swagger')
const router = require('./routers/index')


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
app.use(bodyParser.urlencoded({ extended: true }));

swaggerSetup(app)

app.use('/api', router);

app.use(middleware.unknownEndpoints);
app.use(middleware.errorHandler);

module.exports = app;
