const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const Blog = require('../models/blogModel');

const config = {
  replacement: '-',
  lower: true,
};

const convertToSlug = async (string) => {
  let baseSlug = slugify(string, config);
  const existingBlog = await Blog.findOne({ slug: baseSlug });

  if (existingBlog) {
    const uuid = uuidv4();
    baseSlug += `-${uuid}`;
  }
  return baseSlug;
};

module.exports = convertToSlug;
