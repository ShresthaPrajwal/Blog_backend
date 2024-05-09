const Blog = require('../models/blogModel');

async function uploadBlog(req, res) {
  try {
    const newBlog = new Blog();
    console.log(req.body)
    newBlog.title = req.body.title || 'Title';
    newBlog.content = req.body.content || 'Content';
    newBlog.featuredImage = req.body.featuredImage;
    newBlog.media = req.body.media;

    let savedBlog = await newBlog.save();
    console.log(savedBlog)
    savedBlog = await Blog.findById(savedBlog._id).populate('media').populate('featuredImage');

    res.status(201).json({
      message: 'Blog uploaded successfully!',
      success:'true',
      blog: savedBlog
    });
  } catch (err) {
    next(error);
  }
}

module.exports = { uploadBlog };
