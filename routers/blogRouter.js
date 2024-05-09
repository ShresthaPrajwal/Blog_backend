const blogRouter = require('express').Router();

const upload = require('../utils/multer');
const blogController = require('../controllers/blogController');
const multerErrorHandler = require('../utils/multerError');

blogRouter.post(
  '/upload',
  upload.array('image', 5),
  multerErrorHandler,
  blogController.uploadImage,
);

module.exports = blogRouter;
