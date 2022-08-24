const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
require('dotenv').config();

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
  };
}

function failAuth(res) {
  return res.status(401).end();
}

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async (req, res) => {
  const { username, password } = req.body || {};

  try {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    req.session.user = serializeUser(user);
  } catch (err) {
    console.error(err.message);
    return failAuth(res);
  }
  return res.end();
});
module.exports = router;
