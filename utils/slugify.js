const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const Blog = require('../models/blogModel');

const config = {
  replacement: '-',
  lower: true,
};

const convertToSlug = async (string) => {
  let baseSlug = slugify(string, config);
  let count = 1;
  let existingBlog;

  do {
    existingBlog = await Blog.findOne({ slug: baseSlug });
    if (existingBlog) {
      baseSlug += `-${count}`;
      count += 1;
    }
  } while (existingBlog);

  return baseSlug;
};

module.exports = convertToSlug;
