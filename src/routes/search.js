const express = require('express');
const jikanjs = require('jikanjs');

const router = express.Router();

router.post('/', async (req, res) => {
  const { term } = req.body;

  let arrayOfTitles = (await jikanjs.search('anime', term)).results;

  res.json(JSON.stringify(arrayOfTitles));
});

module.exports = router;
