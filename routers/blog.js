const blogRouter = require('express').Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

blogRouter.post('/upload',authMiddleware,blogController.uploadBlog);

module.exports = blogRouter;
