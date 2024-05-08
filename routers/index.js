const router = require('express').Router();

router.use('/blogs', require('./blogRouter'));
router.use('/media',require('./mediaRouter'))

module.exports = router;
