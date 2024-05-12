const fs = require('fs');
const sharpUtils = require('../utils/sharp');
const Media = require('../models/mediaModel');
const getMediaWithUrls = require('../utils/getMedia');
const success = require('../middlewares/responseApi');

async function uploadMedia(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      const error = new Error('No files uploaded');
      error.status = 400;
      next(error);
    }

    const resizedImagesPromises = req.files.map(
      async (file) => await sharpUtils.resizeAndSaveImage(file.path),
    );

    const resizedImages = await Promise.all(resizedImagesPromises);

    const mediaObjects = req.files.map((file, index) => ({
      filename: file.filename,
      paths: resizedImages[index],
      featuredImage: file.path,
      alternateText: req.body[`alternateText-${index + 1}`],
      caption: req.body[`caption-${index + 1}`],
    }));
    const createdMedia = await Promise.all(
      mediaObjects.map((media) => Media.create(media)),
    );

    const mediaWithUrls = await Promise.all(
      createdMedia.map(async (media) => getMediaWithUrls(req, media, next)),
    );

    res
      .status(201)
      .json(
        success('Media Uploaded Successfully', mediaWithUrls, res.statusCode),
      );
  } catch (error) {
    next(error);
  }
}

async function getAllMedia(req, res, next) {
  try {
    const media = await Media.find();
    const mediaWithUrls = getMediaWithUrls(req, media, next);

    res
      .status(200)
      .json(success('All Media Found', mediaWithUrls, res.statusCode));
  } catch (error) {
    next(error);
  }
}

async function getMediaById(req, res, next) {
  try {
    const media = await Media.findById(req.params.id);
    console.log(media);
    if (!media) {
      const error = new Error('Media Not Found');
      error.status = 404;
      throw error;
    }
    const mediaWithUrls = getMediaWithUrls(req, media, next);

    res
      .status(200)
      .json(success('Requested Media Found', mediaWithUrls, res.statusCode));
  } catch (error) {
    next(error);
  }
}

async function editMedia(req, res, next) {
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

    res
      .status(200)
      .json(
        success('Media Updated Successfully', updatedMedia, res.statusCode),
      );
  } catch (error) {
    next(error);
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
    const featuredImagePath = featuredImage;
    await fs.promises.unlink(featuredImagePath);

    for (const image of paths) {
      const imagePath = image.path;
      await fs.promises.unlink(imagePath);
    }

    res.status(200).json(success('Media Deleted Succesfully', res.statusCode));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadMedia,
  getAllMedia,
  getMediaById,
  deleteMedia,
  editMedia,
};
