const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

const router = Router();

module.exports = router.get('/', authenticate, async (req, res, next) => {
  try {
    const response = await Secret.getAll();
    console.log('---------->', response);
    res.json(response);
  } catch (error) {
    next(error);
  }
});
