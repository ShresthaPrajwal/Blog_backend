require('dotenv').config();

const PORT = process.env.PORT || 3003;
const { MONGO_URI,MONGODB_URI_TEST, UPLOADS_DIR, SECRET, NODE_ENV } = process.env;
module.exports = {
  PORT,
  MONGO_URI,
  UPLOADS_DIR,
  SECRET,
  NODE_ENV,
  MONGODB_URI_TEST
};
