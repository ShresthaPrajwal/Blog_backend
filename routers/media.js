const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multerErrorHandler = require('../utils/multerError');
const upload = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');

router.post(
  '/upload',
  upload.single('image'),
  multerErrorHandler,
  authMiddleware,
  mediaController.uploadMedia,
);

router.get('/:id', mediaController.getMedia);

router.put('/:id', authMiddleware ,mediaController.editMedia)

router.delete('/:id', authMiddleware,mediaController.deleteMedia)

module.exports = router;
