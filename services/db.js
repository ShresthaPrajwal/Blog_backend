const mongoose = require('mongoose');

const config = require('../config/config');
const MONGO_URI = config.MONGO_URI;

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error Connecting to MongoDB:', error.message);
  });

module.exports = mongoose;
