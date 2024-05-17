const bcrypt = require('bcrypt');
const User = require('../models/usersModel');

const getUser = async (request, response) => {
  const users = await User.find({});
  response.json(users);
};

const addUser = async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    if (username.length < 4) {
      response.status(400).end('Username length less than 4');
      return;
    }
    if (password.length < 4) {
      response.status(400).end('password length less than 4');
      return;
    }
    const user = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUser,
  getUser,
};
