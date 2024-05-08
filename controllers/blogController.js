const sharpUtils = require('../utils/sharp');

const Blog = require('../models/blogModel');

async function uploadImage(req, res) {
  if (req.files.length==0) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  try {
    const resizedImageArray = [];
    const newBlog = new Blog();

    for (const file of req.files) {
      console.log(file);
      const resizedImage = await sharpUtils.resizeAndSaveImage(file.path);
      resizedImageArray.push({ imageName: file.filename, paths: resizedImage });
    }
    newBlog.title = req.body.title || 'Title';
    newBlog.content = req.body.content || 'Content';
    newBlog.featuredImage = resizedImageArray;

    await newBlog.save();

    res.json({
      message: 'Image uploaded successfully!',
      filename: req.files.map((file) => file.filename),
      resizedImageArray,
    });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Image size exceeds 1MB limit' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { uploadImage }; // Export the function
