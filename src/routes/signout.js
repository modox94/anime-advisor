const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  req.session?.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie(req.app.get('session cookie name'));
    return res.redirect('/');
  });
});

module.exports = router;
