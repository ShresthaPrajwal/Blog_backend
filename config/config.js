require('dotenv').config();

const PORT = process.env.PORT || 3003;
const { MONGO_URI } = process.env;
const { UPLOADS_DIR } = process.env;
module.exports = {
  PORT,
  MONGO_URI,
  UPLOADS_DIR,
};
