const express = require('express');
// const malScraper = require('mal-scraper');
const jikanjs = require('jikanjs');

const router = express.Router();

router.post('/', async (req, res) => {
  const { term } = req.body;

  let arrayOfTitles = (await jikanjs.search('anime', term)).results;
  // arrayOfTitles = arrayOfTitles.slice(0, 8);

  res.json(JSON.stringify(arrayOfTitles));

  // const regExpIndex = /^https:\/\/myanimelist\.net\/anime\/(\d+)\/\S+/gi;
  // const regExpImg = /\/r\/100x140|\?s=\w+/gi;

  // let arrayOfTitles = await malScraper.search.search('anime', {
  //   term,
  // });

  // arrayOfTitles = arrayOfTitles.slice(0, 8);

  // arrayOfTitles = arrayOfTitles.map((title) => {
  //   title.id = title.url.replace(regExpIndex, '$1');
  //   title.shortDescription = title.shortDescription.replace(
  //     '...read more.',
  //     '...'
  //   );
  //   title.img = title.thumbnail.replace(regExpImg, '');
  //   return title;
  // });

  // res.json(JSON.stringify(arrayOfTitles));
});

module.exports = router;
