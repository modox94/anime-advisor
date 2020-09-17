const express = require('express');
// const malScraper = require('mal-scraper');
const jikanjs = require('jikanjs');
const RutrackerApi = require('rutracker-api');
require('dotenv').config();

const rutracker = new RutrackerApi();
const router = express.Router();

router.post('/', async (req, res) => {
  const { arrayOfId, arrayOfRecomends } = req.body;

  let objectOfTitles = {};
  for (let id of arrayOfId) {
    let currentArrRecom = (await jikanjs.loadAnime(id, 'recommendations'))
      .recommendations;

    for (let currentRecom of currentArrRecom) {
      // console.log(currentRecom.mal_id, currentRecom.recommendation_count);
      // console.log(
      //   currentRecom.mal_id,
      //   arrayOfId.includes(String(currentRecom.mal_id))
      // );
      if (
        objectOfTitles[currentRecom.mal_id] &&
        !arrayOfId.includes(String(currentRecom.mal_id))
      ) {
        objectOfTitles[currentRecom.mal_id]['recommendation_count'] +=
          currentRecom.recommendation_count;
      } else if (!arrayOfId.includes(String(currentRecom.mal_id))) {
        // objectOfTitles[currentRecom.mal_id] = await jikanjs.loadAnime(
        //   currentRecom.mal_id
        // );
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

  // console.log(arrayOfTitles);
  // console.log(Object.values(objectOfTitles));

  res.json(JSON.stringify(arrayOfTitles));
  // let arrayOfTitles = [];
  // for (let card of arrayOfRecomends) {
  //   let response = await malScraper.getRecommendationsList(card.url);
  //   console.log(card.id, '===', response);

  //   arrayOfTitles.push(response);
  // }

  // res.json(JSON.stringify(arrayOfTitles));
});

router.post('/synopsis', async (req, res) => {
  const { id } = req.body;
  console.log(id);

  let dataOfTitle = await jikanjs.loadAnime(id);

  // rutracker

  console.log(process.env.RUTRACKER_LOGIN, process.env.RUTRACKER_PASSWORD);
  await rutracker.login({
    username: process.env.RUTRACKER_LOGIN,
    password: process.env.RUTRACKER_PASSWORD,
  });

  let rutrackerResult = await rutracker.search({
    query: dataOfTitle.title,
    sort: 'size',
  });

  console.log(rutrackerResult);
  // rutracker

  res.json(JSON.stringify(dataOfTitle));
});

module.exports = router;
