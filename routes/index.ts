/// <reference path="../typings/tsd.d.ts"/>
import {Request, Response} from "express";
import {IbcScraper} from "../scraper/jsdom";

var express = require('express');
var router = express.Router();

router.get('/memory_verses', IbcScraper.memoryVerses);

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: Function) {
  res.render('index', { title: 'Islington Church' })
});

module.exports = router;
