const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user.js');

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
  res.render('signin');
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.json({ message: 'Failed' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ message: 'Failed' });
    }
    req.session.user = serializeUser(user);
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Failed' });
  }
  return res.json({ success: true });
});

module.exports = router;
