const sharpUtils = require('../utils/sharp');
const Media = require('../models/mediaModel');
const fs = require('fs');

async function uploadMedia(req, res) {
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

    res.status(201).json({
      message: 'Media uploaded successfully',
      success: 'true',
      data: {
        filename: media.filename,
        paths: media.paths,
        featuredImage: media.featuredImage,
        alternateText: media.alternateText,
        caption: media.caption,
      },
    });
  } catch (error) {
    next(error)
  }
}

async function getAllMedia(req, res) {
  try {
    const media = await Media.find();
    console.log('from getall', media);
    res.json({
      success: true,
      message: `All Media Found`,
      data: media,
    });
  } catch (error) {
    next(error)
  }
}

async function getMediaById(req, res) {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      const errorID = req.params.id;
      const message = 'Media not found';
      const details = `The requested media with ID ${req.params.id} was not found.`;
      const timestamp = new Date().toISOString();

      const errorFormat =
        process.env.NODE_ENV === 'production'
          ? { errorID, message, timestamp }
          : { errorID, message, details, timestamp };

      return res.status(404).json({ success: false, error: errorFormat });
    }
    res.json({
      success: true,
      message: `Requested Media Found`,
      data: media,
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

async function deleteMedia(req, res) {
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
