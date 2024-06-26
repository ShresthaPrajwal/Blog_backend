const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./services/db');
const middleware = require('./middlewares/middleware');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSetup = require('./config/swagger');
const router = require('./routers/index');

const app = express();

app.use(express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(bodyParser.urlencoded({ extended: true }));

swaggerSetup(app);

app.use('/api', router);

app.use(middleware.unknownEndpoints);
app.use(errorHandler);

module.exports = app;
