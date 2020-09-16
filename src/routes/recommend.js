const express = require('express');
const malScraper = require('mal-scraper');

const router = express.Router();

router.post('/', async (req, res) => {
  const { arrayOfRecomends } = req.body;
  // console.log(arrayOfRecomends);

  let arrayOfTitles = [];
  for (let card of arrayOfRecomends) {
    let arrayOfTitles = await malScraper.getRecommendationsList(card.id);
  }
  console.log(arrayOfTitles);

  // res.end();
  res.json(JSON.stringify(arrayOfTitles));
});

module.exports = router;
