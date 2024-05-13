const { v4: uuidv4 } = require('uuid');
const Blog = require('../models/blogModel');
const getBlogWithUrl = require('../utils/getBlogs');
const convertToSlug = require('../utils/slugify');

async function uploadBlog(req, res, next) {
  try {
    const newBlog = new Blog();
    console.log(req.body);
    newBlog.title = req.body.title || 'Title';
    newBlog.content = req.body.content || 'Content';
    newBlog.featuredImage = req.body.featuredImage;
    newBlog.media = req.body.media;

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
    const blogs = await Blog.find().populate('media').populate('featuredImage');
    const blogsWithUpdatedUrl = getBlogWithUrl(req, blogs, next);

    res.status(200).json({
      success: true,
      data: blogsWithUpdatedUrl,
    });
  } catch (error) {
    next(error);
  }
}

async function getBlogBySlug(req, res, next) {
  try {
    const slug = req.params.slug;
    const blog = await Blog.findOne({ slug })

    const populatedBlog = await Blog.populate(blog, {
      path: 'media featuredImage',
    });
      
    console.log(blog, populatedBlog);
    
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

    let updatedBlog = await Blog.findOneAndUpdate(
      { slug: blogSlug },
      { title, content, featuredImage, media },
      { new: true },
    );
    updatedBlog = await Blog.populate(updatedBlog, {
      path: 'media featuredImage',
    });

    console.log(updatedBlog);
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
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
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
