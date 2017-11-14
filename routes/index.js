"use strict";
var jsdom_1 = require("../scraper/jsdom");
var express = require('express');
var router = express.Router();
router.get('/memory_verses', jsdom_1.IbcScraper.memoryVerses);
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Islington Church' });
});
module.exports = router;
