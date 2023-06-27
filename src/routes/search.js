const express = require("express");
const Jikan = require("jikan4.js");
const { redisGet, redisSet } = require("../../db/redis");
const { REDIS_TYPES } = require("../constants");
const { getRedisKey, recomposeFromSearch } = require("../utils");

const client = new Jikan.Client(); // TODO
const router = express.Router();

// search(searchString, filter, offset, maxCount)
// filter {}
// score
// minScore
// maxScore
// sfw
// genres
// excludeGenres
// producers
// orderBy

router.get("/", async (req, res) => {
  const { term, offset = 0, maxCount = 20 } = req.query || {};
  const filter = {};
  let result = [];

  // console.log("offset", typeof offset);
  // console.log("maxCount", typeof maxCount);

  const redisKey = getRedisKey(REDIS_TYPES.SEARCH, { term, offset, maxCount });

  const cachedData = await redisGet(redisKey);
  if (cachedData) {
    result = cachedData;
  } else {
    const cardsArray =
      (await client.anime.search(
        term,
        filter,
        Number(offset),
        Number(maxCount)
      )) || [];

    redisSet(redisKey, cardsArray);
    cardsArray.forEach((cardItem) => {
      const { id } = cardItem;
      const redisItemKey = getRedisKey(REDIS_TYPES.SEARCH_ITEM, { id });
      redisSet(redisItemKey, cardItem);
    });

    result = cardsArray;
  }

  result = recomposeFromSearch(result);
  res.json(JSON.stringify(result));
});

module.exports = router;
