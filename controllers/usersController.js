const bcrypt = require('bcrypt');
const User = require('../models/usersModel');

const getUser = async (request, response) => {
  const users = await User.find({});
  response.status(200).json(users);
};

const addUser = async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (name.length === 0)
      return response.status(400).json({ error: 'Name cannot be empty' });

    if (username.length < 4) {
      const message =
        username.length === 0
          ? 'Username cannot be empty'
          : 'Username length less than 4';

      return response.status(400).json({ error: message });
    }
    if (password.length < 4) {
      const message =
        password.length === 0
          ? 'Password cannot be empty'
          : 'Password length less than 4';
      return response.status(400).json({ error: message });
    }

    const userCheck = await User.findOne({ username });
    if (userCheck) {
      return response.status(400).json({ error: 'Username already taken' });
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

const updateUser = async (request, response, next) => {
  try {
    const { username } = request.params;
    const { name, password } = request.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await User.findOneAndUpdate({ username }, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (request, response, next) => {
  try {
    const { username } = request.params;
    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
};
