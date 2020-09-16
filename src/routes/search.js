const express = require('express');
const malScraper = require('mal-scraper');

const router = express.Router();

router.post('/', async (req, res) => {
  const { term } = req.body;
  const regExpIndex = /^https:\/\/myanimelist\.net\/anime\/(\d+)\/\w+/gi;
  const regExpImg = /\/r\/100x140|\?s=\w+/gi;

  let arrayOfTitles = await malScraper.search.search('anime', {
    term,
  });

  arrayOfTitles = arrayOfTitles.map((title) => {
    title.id = title.url.replace(regExpIndex, '$1');
    title.shortDescription = title.shortDescription.replace(
      '...read more.',
      '...'
    );
    title.img = title.thumbnail.replace(regExpImg, '');
    return title;
  });

  res.json(JSON.stringify(arrayOfTitles));
});

module.exports = router;
