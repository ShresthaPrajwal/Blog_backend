const Blog = require('../models/blogModel');
const getBlogWithUrl = require('../utils/getBlogs');

async function uploadBlog(req, res, next) {
  try {
    const newBlog = new Blog();
    console.log(req.body);
    newBlog.title = req.body.title || 'Title';
    newBlog.content = req.body.content || 'Content';
    newBlog.featuredImage = req.body.featuredImage;
    newBlog.media = req.body.media;

    let savedBlog = await newBlog.save();
    savedBlog = await Blog.findById(savedBlog._id)
      .populate('media')
      .populate('featuredImage');

    const savedBlogWithUpdatedUrl = getBlogWithUrl(req,savedBlog,next)

    res.status(201).json({
      message: 'Blog uploaded successfully!',
      success: true,
      data: savedBlogWithUpdatedUrl,
    });
  } catch (err) {
    next(error);
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

async function getBlogById(req, res, next) {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId)
      .populate('media')
      .populate('featuredImage');
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
}


module.exports = { uploadBlog, getAllBlogs, getBlogById };
