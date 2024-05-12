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

    // Blog.populate(savedBlog,[{path:'media'},{path:'featuredImage'}],(error,data)=>{
    //   console.log(data)
    // })

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

async function getBlogById(req, res, next) {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId)
      .populate('media')
      .populate('featuredImage');
    if (!blog) {
      const error = new Error('Blog not found');
      error.status(404);
      next(error);
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
    const blogId = req.params.id;
    const { title, content, featuredImage, media } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, featuredImage, media },
      { new: true },
    )
      .populate('media')
      .populate('featuredImage');

    if (!updatedBlog) {
      const error = new Error('Blog not found');
      error.status(404);
      next(error);
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
      const error = new Error('Blog not found')
      error.status(404)
      next(error)
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

module.exports = { uploadBlog, getAllBlogs, getBlogById , updateBlog , deleteBlog };
