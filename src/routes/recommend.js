const express = require("express");
const Jikan = require("jikan4.js");
const { pantsu } = require("nyaapi");
const { get, set } = require("lodash");

const client = new Jikan.Client();
const router = express.Router();

router.post("/", async (req, res) => {
  const { arrayOfId } = req.body || {};
  const objectOfTitles = {};
  for (const id of arrayOfId) {
    const curRecArr = (await client.anime.getRecommendations(id)) || [];

    for (const curRec of curRecArr) {
      const curRecId = String(get(curRec, ["entry", "id"], ""));
      const curRecImage = get(curRec, ["entry", "image", "default"], "");
      const curRecTitle = get(curRec, ["entry", "title"], "");
      const curRecUrl = get(curRec, ["entry", "url"], "");
      const curRecVotes = get(curRec, ["votes"], "");
      const recomCountPath = [curRecId, "recommendation_count"];

      if (!objectOfTitles[curRecId]) {
        set(objectOfTitles, [curRecId, "id"], curRecId);
        set(
          objectOfTitles,
          [curRecId, "image", "webp", "default"],
          curRecImage
        );
        set(objectOfTitles, [curRecId, "title", "default"], curRecTitle);
        set(objectOfTitles, [curRecId, "url"], curRecUrl);
        set(objectOfTitles, recomCountPath, curRecVotes);
      }

      if (!arrayOfId.includes(curRecId)) {
        const oldValue = get(objectOfTitles, recomCountPath, 0);
        set(objectOfTitles, recomCountPath, oldValue + curRec.votes);
      }
    }
  }

  const arrayOfTitles = Object.values(objectOfTitles).sort(function (a, b) {
    if (a.recommendation_count < b.recommendation_count) {
      return 1;
    }
    if (a.recommendation_count > b.recommendation_count) {
      return -1;
    }
    return 0;
  });

  res.json(JSON.stringify(arrayOfTitles));
});

router.post("/synopsis", async (req, res) => {
  const { id } = req.body || {};

  const dataOfTitle = await client.anime.get(id);

  let arrayOfTorrents = [];
  // pantsu TODO
  try {
    arrayOfTorrents =
      (await pantsu.search(dataOfTitle.title.toString(), 10, {
        order: false,
        sort: "4",
        c: "3_5",
        limit: 10,
      })) || [];

    arrayOfTorrents = arrayOfTorrents.map((torrent) => {
      torrent.filesizeGb = (torrent.filesize / 1073741824).toFixed(2);

      return torrent;
    });
  } catch (error) {
    if (error) console.log("id pantsu error", id, error.message);
  }

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

  res.json(JSON.stringify({ dataOfTitle, arrayOfTorrents }));
});

module.exports = router;
