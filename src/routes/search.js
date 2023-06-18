const express = require("express");
const Jikan = require("jikan4.js");

const client = new Jikan.Client();
const router = express.Router();

router.post("/", async (req, res) => {
  const { term } = req.body || {};
  const cardsArray = (await client.anime.search(term)) || [];
  res.json(JSON.stringify(cardsArray));
});

module.exports = router;
