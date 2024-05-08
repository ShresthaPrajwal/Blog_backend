const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
/**
 * @swagger
 * tags:
 *   name: Media
 *   description: API endpoints for managing media files
 */
/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload a media file
 *     description: Upload a media file to the server
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
 *               alternateText:
 *                 type: string
 *                 description: Alternate text for the uploaded image
 *               caption:
 *                 type: string
 *                 description: Caption for the uploaded image
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/upload', mediaController.uploadMedia);
/**
 * @swagger
 * /media/{id}:
 *   get:
 *     summary: Get media by ID
 *     description: Get media details by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media details retrieved successfully
 *       404:
 *         description: Media not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', mediaController.getMedia);

module.exports = router;
