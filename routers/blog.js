const blogRouter = require('express').Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');
const Blog = require('../models/blogModel');
const paginationMiddleware = require('../middlewares/pagination');

blogRouter.post('/', authMiddleware, blogController.uploadBlog);

blogRouter.get(
  '/',
  paginationMiddleware(Blog, 'blogs', 'media featuredImage'),
  blogController.getAllBlogs,
);

blogRouter.get('/:slug', blogController.getBlogBySlug);

blogRouter.put('/:slug', authMiddleware, blogController.updateBlog);

blogRouter.delete('/:slug', authMiddleware, blogController.deleteBlog);

module.exports = blogRouter;
