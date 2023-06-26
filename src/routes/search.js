const express = require("express");
const Jikan = require("jikan4.js");
const { redisGet, redisSet } = require("../../db/redis");

const SEARCH = "SEARCH_"; // TODO

const client = new Jikan.Client(); // TODO
const router = express.Router();

router.post("/", async (req, res) => {
  const { term } = req.body || {};
  let result = [];

  const cachedData = await redisGet(`${SEARCH}${term}`);
  if (cachedData) {
    result = cachedData;
  } else {
    const cardsArray = (await client.anime.search(term)) || [];
    redisSet(`${SEARCH}${term}`, cardsArray);
    result = cardsArray;
  }

  res.json(JSON.stringify(result));
});

module.exports = router;
