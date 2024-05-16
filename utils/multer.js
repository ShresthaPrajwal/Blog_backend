const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const allowedExtensions = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    // Pass an empty error object and the destination path to the callback
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/[^a-z0-9.-]/gi, '-');
    const uuid = uuidv4();
    req.generatedUUID = uuid;
    const filenameWithUUID = `${uuid}-${sanitizedFilename}`;
    // Pass an empty error object and the filename to the callback
    cb(null, filenameWithUUID);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Only images allowed!'));
    }
    // Pass an empty error object and true to the callback
    cb(null, true);
  },
});

module.exports = upload;
