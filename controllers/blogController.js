const Blog = require('../models/blogModel');
const getBlogWithUrl = require('../utils/getBlogs');
const convertToSlug = require('../utils/slugify');

async function uploadBlog(req, res, next) {
  try {
    const newBlog = new Blog();

    const { title, content, featuredImage, media } = req.body;

    if (!title) {
      res.status(400).json({ message: 'title is required' });
    }
    if (!content) {
      res.status(400).json({ message: 'content is required' });
    }
    newBlog.title = title;
    newBlog.content = content;
    newBlog.featuredImage = featuredImage || null;
    newBlog.media = media;

    const slug = await convertToSlug(newBlog.title);
    newBlog.slug = slug;
    const savedBlog = await newBlog.save();

    await Blog.populate(savedBlog, { path: 'media featuredImage' });
    const savedBlogWithUpdatedUrl = getBlogWithUrl(req, savedBlog, next);

    res.status(201).json({
      message: 'Blog uploaded successfully!',
      success: true,
      data: savedBlogWithUpdatedUrl,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllBlogs(req, res, next) {
  try {
    const data = await res.paginatedResults.data;
    console.log('from getAllBlogs', data);
    const blogsWithUpdatedUrl = getBlogWithUrl(req, data, next);
    res.json({ ...res.paginatedResults, data: blogsWithUpdatedUrl });
  } catch (error) {
    next(error);
  }
}

async function getBlogBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    const populatedBlog = await Blog.populate(blog, {
      path: 'media featuredImage',
    });

    if (!blog) {
      const error = new Error('Blog not found');
      error.status = 404;
      throw error;
    }
    const blogWithUrl = getBlogWithUrl(req, blog, next);

    res.status(200).json({
      success: true,
      data: blogWithUrl,
    });
  } catch (error) {
    next(error);
  }
}

async function updateBlog(req, res, next) {
  try {
    const blogSlug = req.params.slug;
    const { title, content, featuredImage, media } = req.body;

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: blogSlug },
      { title, content, featuredImage, media },
      { new: true },
    );
    const populatedBlog = await Blog.populate(updatedBlog, {
      path: 'media featuredImage',
    });
    if (!updatedBlog) {
      const error = new Error('Blog not found');
      error.status = 404;
      throw error;
    }
    if (title && title !== updatedBlog.title) {
      updatedBlog.slug = convertToSlug(title);
      await updatedBlog.save();
    }

    const updatedblogWithUrl = getBlogWithUrl(req, updatedBlog, next);

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedblogWithUrl,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteBlog(req, res, next) {
  try {
    const blogSlug = req.params.slug;
    const deletedBlog = await Blog.findOneAndDelete({ slug: blogSlug });
    if (!deletedBlog) {
      const error = new Error('Blog not found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: deletedBlog,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
