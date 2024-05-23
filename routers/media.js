const express = require('express');

const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multerErrorHandler = require('../utils/multerError');
const upload = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');
const paginationMiddleware = require('../middlewares/pagination');
const Media = require('../models/mediaModel')
router.post(
  '/',
  authMiddleware,
  upload.array('image'),
  multerErrorHandler,
  mediaController.uploadMedia,
);

router.get('/',paginationMiddleware(Media,'media'), mediaController.getAllMedia);

router.get('/:id', mediaController.getMediaById);

router.put('/:id', authMiddleware, mediaController.editMedia);

router.delete('/:id', authMiddleware, mediaController.deleteMedia);

module.exports = router;
