const blogRouter = require('express').Router();

const upload = require('../utils/multer');
const blogController = require('../controllers/blogController');
const multerErrorHandler = require('../utils/multerError');
/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: API endpoints for managing blog posts
 */

/**
 * @swagger
 * /blogs/upload:
 *   post:
 *     summary: Upload images for a blog post
 *     description: Upload images for a blog post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       500:
 *         description: Internal server error
 */
blogRouter.post(
  '/upload',
  upload.array('image', 5),
  multerErrorHandler,
  blogController.uploadImage,
);

module.exports = blogRouter;
