const router = require('express').Router();

router.use('/blogs', require('./blogRouter'));
router.use('/media',require('./mediaRouter'));
router.use('/login',require('./loginRouter'));
router.use('/users',require('./userRouter'))

module.exports = router;
