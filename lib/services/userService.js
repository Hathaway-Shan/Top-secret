const bcrypt = require('bcrypt');
const User = require('../models/User');
// const jwt = require('jsonwebtoken');

module.exports = class UserService {
  static async create({ firstName, lastName, email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      firstName,
      lastName,
      email,
      passwordHash,
    });
    return user;
  }
};
