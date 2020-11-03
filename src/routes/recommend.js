const express = require('express');
const jikanjs = require('jikanjs');
const { si, pantsu } = require('nyaapi');

const router = express.Router();

router.post('/', async (req, res) => {
  const { arrayOfId, arrayOfRecomends } = req.body;

  let objectOfTitles = {};
  for (let id of arrayOfId) {
    let currentArrRecom = (await jikanjs.loadAnime(id, 'recommendations'))
      .recommendations;

    for (let currentRecom of currentArrRecom) {
      if (
        objectOfTitles[currentRecom.mal_id] &&
        !arrayOfId.includes(String(currentRecom.mal_id))
      ) {
        objectOfTitles[currentRecom.mal_id]['recommendation_count'] +=
          currentRecom.recommendation_count;
      } else if (!arrayOfId.includes(String(currentRecom.mal_id))) {
        objectOfTitles[currentRecom.mal_id] = currentRecom;
        objectOfTitles[currentRecom.mal_id]['recommendation_count'] =
          currentRecom.recommendation_count;
      }
    }
  }

  let arrayOfTitles = Object.values(objectOfTitles).sort(function (a, b) {
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

router.post('/synopsis', async (req, res) => {
  const { id } = req.body;

  let dataOfTitle = await jikanjs.loadAnime(id);

  let arrayOfTorrents = [];
  // pantsu
  try {
    arrayOfTorrents = await pantsu.search(dataOfTitle.title, 10, {
      order: false,
      sort: '4',
      c: '3_5',
      limit: 10,
    });

    arrayOfTorrents = arrayOfTorrents.map((torrent) => {
      torrent.filesizeGb = (torrent.filesize / 1073741824).toFixed(2);

      return torrent;
    });
  } catch (error) {
    if (error) console.log('id pantsu error', id, error.message);
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
