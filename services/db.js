const mongoose = require('mongoose');
const config = require('../config/config');
const env = process.env.NODE_ENV;
const { MONGO_URI , MONGODB_URI_TEST } = config;
let workingURI;
mongoose.set('strictQuery', false);

if (env === 'test') {
  workingURI = MONGODB_URI_TEST
} else {
  workingURI = MONGO_URI
}
console.log(workingURI)
mongoose
  .connect(workingURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error Connecting to MongoDB:', error.message);
  });

module.exports = mongoose;
