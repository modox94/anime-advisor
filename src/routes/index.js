const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  if (req.session?.user) {
    // вытягивание из базы данных массивов
    return res.render("index", { index: true });
  }

  res.render("index", { index: true });
});

module.exports = router;
