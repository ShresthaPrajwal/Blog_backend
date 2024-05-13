const blogRouter = require('express').Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

blogRouter.post('/', authMiddleware, blogController.uploadBlog);

blogRouter.get('/', blogController.getAllBlogs);

blogRouter.get('/:slug', blogController.getBlogBySlug);

blogRouter.put('/:slug', authMiddleware, blogController.updateBlog);

blogRouter.delete('/:slug', authMiddleware, blogController.deleteBlog);

module.exports = blogRouter;
