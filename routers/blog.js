const blogRouter = require('express').Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

blogRouter.post('/', authMiddleware, blogController.uploadBlog);

blogRouter.get('/', blogController.getAllBlogs);

blogRouter.get('/:id', blogController.getBlogById);

blogRouter.put('/:id', authMiddleware, blogController.updateBlog);

blogRouter.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = blogRouter;
