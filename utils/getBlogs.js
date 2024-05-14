const Blog = require('../models/blogModel');
const getMediaWithUrls = require('./getMedia');

const getBlogWithUrl = (req, blog, next) => {
  try {
    if (Array.isArray(blog)) {
      const blogsWithUpdatedUrl = blog.map((item) => {
        if (item instanceof Blog) item = item.toObject();
        const blogWithUpdatedUrl = {
          ...item,
          media: getMediaWithUrls(req, item.media, next),
          featuredImage: getMediaWithUrls(req, item.featuredImage, next),
        };
        return blogWithUpdatedUrl;
      });
      return blogsWithUpdatedUrl;
    }
    if (blog instanceof Blog) blog = blog.toObject();
    const blogWithUpdatedUrl = {
      ...blog,
      media: getMediaWithUrls(req, blog.media, next),
    };
    return blogWithUpdatedUrl;
  } catch (error) {
    next(error);
  }
};

module.exports = getBlogWithUrl;
