const upload = require('../utils/multer');
const multer = require('multer');
const sharpUtils = require('../utils/sharp');
const Media = require('../models/mediaModel');

async function uploadMedia(req, res) {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      console.log(req.file);
      const resizedImages = await sharpUtils.resizeAndSaveImage(req.file.path);

      const featuredImage = req.file.path;//originalImage
      const { alternateText, caption } = req.body;

      const media = await Media.create({
        filename: req.file.filename,
        uuid: req.generatedUUID,
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getMedia(req, res) {
  try {
    const media = await Media.findOne({ uuid: req.params.id });

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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Add other CRUD operations as needed

module.exports = { uploadMedia, getMedia };
