const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET } = require('../config/config');
const User = require('../models/usersModel');

async function loginController(request, response, next) {
  try {
    const { username, password } = request.body;

    if (username === '' && password === '') {
      return response.status(401).json({
        error: 'Empty Username and Password',
      });
    }
    if (username === '') {
      return response.status(401).json({
        error: 'Empty Username',
      });
    }
    if (password === '') {
      return response.status(401).json({
        error: 'Empty Password',
      });
    }

    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });
    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
}

module.exports = loginController;
