const { Router } = require('express');
const UserService = require('../services/userService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const sessionToken = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'sign in successful' });
    } catch (error) {
      next(error);
    }
  });
