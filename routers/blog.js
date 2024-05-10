const blogRouter = require('express').Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

blogRouter.post('/',authMiddleware,blogController.uploadBlog);

blogRouter.get('/',blogController.getAllBlogs)

module.exports = blogRouter;
