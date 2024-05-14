const Blog = require('../models/blogModel');
const getBlogWithUrl = require('../utils/getBlogs');
const convertToSlug = require('../utils/slugify');

const defaultLimit = 2;
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
    const {
      page = 1,
      size = defaultLimit,
      sort = 'title',
      order = 'asc',
      search = '',
    } = req.query;

    const query = { title: { $regex: search, $options: 'i' } };

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / size);

    const currentPage = Math.max(1, Math.min(page, totalPages));
    const currentSkip = (currentPage - 1) * size;

    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .limit(size)
      .skip(currentSkip)
      .populate('media featuredImage');

    const baseUrl = `${req.protocol}://${req.header('Host')}/api/blogs`;

    const nextPageUrl =
      currentPage < totalPages
        ? `${baseUrl}?page=${currentPage + 1}&size=${size}&sort=${sort}&order=${order}&search=${search}`
        : null;

    const prevPageUrl =
      currentPage > 1
        ? `${baseUrl}?page=${currentPage - 1}&size=${size}&sort=${sort}&order=${order}&search=${search}`
        : null;

    const blogsWithUpdatedUrl = getBlogWithUrl(req, blogs, next);
    res.status(200).json({
      success: true,
      data: blogsWithUpdatedUrl,
      pagination: {
        currentPage,
        totalPages,
        perPage: size,
        totalItems: totalBlogs,
        nextPageUrl,
        prevPageUrl,
      },
    });
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

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: blogSlug },
      { title, content, featuredImage, media },
      { new: true },
    );
    const populatedBlog = await Blog.populate(updatedBlog, {
      path: 'media featuredImage',
    });
    console.log(populatedBlog);
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
