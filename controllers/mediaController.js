const sharpUtils = require('../utils/sharp');
const Media = require('../models/mediaModel');
const fs = require('fs');
const getMediaWithUrls = require('../utils/getMedia')

async function uploadMedia(req, res , next ) {
  try {
    console.log('From controller media', req.body);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const resizedImages = await sharpUtils.resizeAndSaveImage(req.file.path);

    const featuredImage = req.file.path;
    const { alternateText, caption } = req.body;

    const media = await Media.create({
      filename: req.file.filename,
      paths: resizedImages,
      featuredImage,
      alternateText,
      caption,
    });
    console.log(media)
    const mediaWithUrls = getMediaWithUrls(req,media,next)

    res.status(201).json({
      message: 'Media uploaded successfully',
      success: true,
      data: mediaWithUrls,
    });
  } catch (error) {
    next(error)
  }
}

async function getAllMedia(req, res,next) {
  try {
    const media = await Media.find();
    const mediaWithUrls = getMediaWithUrls(req,media,next);
    
    res.json({
      success: true,
      message: `All Media Found`,
      data: mediaWithUrls,
    });
  } catch (error) {
    next(error)
  }
}

async function getMediaById(req, res , next) {
  try {
    const media = await Media.findById(req.params.id);
    console.log(media);
    if (!media) {
      const error = new Error('Media Not Found');
      error.status = 404;
      next(error);
    }
    const mediaWithUrls = getMediaWithUrls(req, media, next);
    
    res.json({
      success: true,
      message: `Requested Media Found`,
      data: mediaWithUrls,
    });
  } catch (error) {
    next(error)
  }
}

async function editMedia(req, res) {
  try {
    const { alternateText, caption } = req.body;
    const mediaId = req.params.id;

    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    media.alternateText = alternateText || media.alternateText;
    media.caption = caption || media.caption;

    const updatedMedia = await media.save();

    res.status(200).json({
      message: 'Media updated successfully',
      success: 'true',
      data: updatedMedia,
    });
  } catch (error) {
    next(error)
  }
}

async function deleteMedia(req, res, next) {
  try {
    const mediaId = req.params.id;

    const media = await Media.findByIdAndDelete(mediaId);

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    const { featuredImage, paths } = media;
    console.log(media);
    const featuredImagePath = featuredImage;
    await fs.promises.unlink(featuredImagePath);

    for (const image of paths) {
      const imagePath = image.path;
      await fs.promises.unlink(imagePath);
    }
    res.status(200).json({
      message: 'Media deleted successfully',
      success: 'true',
    });
  } catch (error) {
      next(error)
  }
}

module.exports = {
  uploadMedia,
  getAllMedia,
  getMediaById,
  deleteMedia,
  editMedia,
};
