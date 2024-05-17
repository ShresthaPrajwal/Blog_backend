const sharp = require('sharp');
const path = require('path');
const config = require('../config/config');

const resizeAndSaveImage = async (imagePath, uuid) => {
  try {
    const originalImage = sharp(imagePath);
    const metadata = await originalImage.metadata();
    const resolutions = [
      {
        width: 800,
        height: Math.round((metadata.height / metadata.width) * 800),
      },
      {
        width: 400,
        height: Math.round((metadata.height / metadata.width) * 400),
      },
      {
        width: 200,
        height: Math.round((metadata.height / metadata.width) * 200),
      },
      {
        width: 100,
        height: Math.round((metadata.height / metadata.width) * 100),
      },
    ];
    const resizedImages = [];
    for (const resolution of resolutions) {
      const resizedImageBuffer =
        metadata.width < resolution.width
          ? await originalImage.toBuffer()
          : await originalImage
              .resize(resolution.width, resolution.height)
              .toBuffer();

      const folderName = (function () {
        switch (true) {
          case resolution.width >= 800:
            return 'large';
          case resolution.width >= 400:
            return 'medium';
          case resolution.width >= 200:
            return 'small';
          default:
            return 'extrasmall';
        }
      })();

      const folderPath = path.join(
        process.env.NODE_ENV === 'test' ? 'test_uploads/' : config.UPLOADS_DIR,
        folderName,
      );
      await createFolderIfNotExists(folderPath);

      const resizedFilename = `${
        path.basename(imagePath).split('.')[0]
      }-${folderName}-${uuid}.jpg`;
      const resizedImagePath = path.join(folderPath, resizedFilename);
      const normalizedPath = resizedImagePath.split(path.sep).join('/');

      await sharp(resizedImageBuffer).toFile(resizedImagePath);
      resizedImages.push({
        size: folderName,
        width: resolution.width,
        path: normalizedPath,
      });
    }

    return resizedImages;
  } catch (error) {
    console.error('Error processing Image:', error);
    throw error;
  }
};

// Helper function to create folder if it doesn't exist
const createFolderIfNotExists = async (folderPath) => {
  const fs = require('fs').promises;
  try {
    await fs.access(folderPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(folderPath);
    } else {
      throw error;
    }
  }
};

module.exports = {
  resizeAndSaveImage,
};
