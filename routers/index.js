const router = require('express').Router();

router.use('/blogs', require('./blog'));
router.use('/media',require('./media'));
router.use('/login',require('./login'));
router.use('/users',require('./user'))

module.exports = router;
