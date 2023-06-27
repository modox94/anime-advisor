const express = require("express");
const Jikan = require("jikan4.js");
// const { pantsu } = require("nyaapi");
const { get, set } = require("lodash");
const { REDIS_TYPES } = require("../constants");
const {
  getRedisKey,
  recomposeFromRecommendations,
  recomposeFromSearch,
} = require("../utils");
const { redisGet, redisSet } = require("../../db/redis");

const client = new Jikan.Client();
const router = express.Router();

router.post("/", async (req, res) => {
  let { arrayOfId = [] } = req.body || {};
  arrayOfId = arrayOfId.map((idEl) => Number(idEl));
  const resultObj = {};

  for (const id of arrayOfId) {
    let recomArray;
    const redisKey = getRedisKey(REDIS_TYPES.RECOMMENDATIONS, { id });
    const cachedData = await redisGet(redisKey);
    if (cachedData) {
      recomArray = cachedData;
    } else {
      recomArray = (await client.anime.getRecommendations(id)) || [];
      redisSet(redisKey, recomArray);
    }

    const recomposedArray = recomposeFromRecommendations(recomArray);

    for (const recomObj of recomposedArray) {
      const { id: recomId, votes } = recomObj;

      if (arrayOfId.includes(recomId)) {
        continue;
      }

      if (!resultObj[recomId]) {
        resultObj[recomId] = recomObj;
      } else {
        const prevVotes = get(resultObj, [recomId, "votes"], 0);
        set(resultObj, [recomId, "votes"], prevVotes + votes);
      }
    }
  }

  const result = Object.values(resultObj).sort(function (a, b) {
    if (a.votes < b.votes) {
      return 1;
    }
    if (a.votes > b.votes) {
      return -1;
    }
    return 0;
  });

  res.json(JSON.stringify(result));
});

router.post("/synopsis", async (req, res) => {
  const { id } = req.body || {};

  let resultRaw;
  const redisKey = getRedisKey(REDIS_TYPES.SEARCH_ITEM, { id });
  const cachedData = await redisGet(redisKey);
  if (cachedData) {
    resultRaw = cachedData;
  } else {
    resultRaw = await client.anime.get(id);
    redisSet(redisKey, resultRaw);
  }

  // let arrayOfTorrents = [];
  // // pantsu TODO
  // try {
  //   arrayOfTorrents =
  //     (await pantsu.search(dataOfTitle.title.toString(), 10, {
  //       order: false,
  //       sort: "4",
  //       c: "3_5",
  //       limit: 10,
  //     })) || [];

  //   arrayOfTorrents = arrayOfTorrents.map((torrent) => {
  //     torrent.filesizeGb = (torrent.filesize / 1073741824).toFixed(2);

  //     return torrent;
  //   });
  // } catch (error) {
  //   if (error) console.log("id pantsu error", id, error.message);
  // }

  // if (!arrayOfTorrents.length) {
  //   try {
  //     arrayOfTorrents = await si.search(dataOfTitle.title, 10, {
  //       order: false,
  //       category: '3_5',
  //     });

  //     arrayOfTorrents = arrayOfTorrents.map((torrent) => {
  //       torrent.filesizeGb = (torrent.filesize / 1073741824).toFixed(2);

  //       return torrent;
  //     });
  //   } catch (error) {
  //     if (error) console.log('id si error', id, error.message);
  //   }
  // }
  // pantsu

  // res.json(JSON.stringify({ dataOfTitle, arrayOfTorrents }));
  res.json(
    JSON.stringify({
      dataOfTitle: recomposeFromSearch(resultRaw),
      arrayOfTorrents: [],
    })
  );
});

module.exports = router;
