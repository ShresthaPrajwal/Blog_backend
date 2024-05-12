const userRouter = require('express').Router();
const userController = require('../controllers/usersController');

userRouter.post('/register', userController.addUser);

module.exports = userRouter;
