const multer = require('multer');

const multerErrorHandler = (err, req, res, next) => {
    console.log("From multerErrorHandler" ,req.files)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'File size limit exceeded', error: err.message });
    }
    return res
      .status(500)
      .json({ message: 'Multer error', error: err.message });
  } else if (err) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
  next();
};

module.exports = multerErrorHandler
