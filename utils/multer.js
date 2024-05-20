const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const allowedExtensions = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('from destination',file);
    const folderName =
      process.env.NODE_ENV === 'test' ? 'test_uploads' : 'uploads';
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    cb(null, `${folderName}/`);
  },
  filename(req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/[^a-z0-9.-]/gi, '-');
    const uuid = uuidv4();
    req.generatedUUID = uuid;
    const filenameWithUUID = `${uuid}-${sanitizedFilename}`;
    cb(null, filenameWithUUID);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log('from ext',ext)
    if (!allowedExtensions.includes(ext)) {
      console.log('here')
      return cb(new Error('Only images allowed!'));
    }
    console.log('im here')
    cb(null, true);
  },
});

module.exports = upload;
