const userRouter = require('express').Router();
const userController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

userRouter.post('/', userController.addUser);
userRouter.get('/', userController.getUser);
userRouter.put('/:username', authMiddleware, userController.updateUser);
userRouter.delete('/:username', authMiddleware, userController.deleteUser);

module.exports = userRouter;
