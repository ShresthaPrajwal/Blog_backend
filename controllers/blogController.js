const Blog = require('../models/blogModel');
const getMediaWithUrls = require('../utils/getMedia');


async function uploadBlog(req, res, next) {
  try {
    const newBlog = new Blog();
    console.log(req.body)
    newBlog.title = req.body.title || 'Title';
    newBlog.content = req.body.content || 'Content';
    newBlog.featuredImage = req.body.featuredImage;
    newBlog.media = req.body.media;

    let savedBlog = await newBlog.save();
    savedBlog = await Blog.findById(savedBlog._id).populate('media').populate('featuredImage');
    if(savedBlog instanceof Blog) savedBlog=savedBlog.toObject()
    const savedBlogWithUpdatedUrl = {...savedBlog,media:getMediaWithUrls(req,savedBlog.media,next)}

    res.status(201).json({
      message: 'Blog uploaded successfully!',
      success:true,
      data: savedBlogWithUpdatedUrl
    });
  } catch (err) {
    next(error);
  }
}

async function getAllBlogs(req,res,next){
  try {
    const blogs = await Blog.find().populate('media').populate('featuredImage');

    const blogsWithUpdatedUrl = blogs.map((blog)=>{
      if (blog instanceof Blog) blog = blog.toObject();
      const blogWithUpdatedUrl = {
        ...blog,
        media: getMediaWithUrls(req, blog.media, next),
      };
      return blogWithUpdatedUrl
    })

    
    
    res.status(200).json({
      success: true,
      data: blogsWithUpdatedUrl,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadBlog, getAllBlogs };
