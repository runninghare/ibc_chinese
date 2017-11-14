"use strict";
var jsdom = require('jsdom');
var jquery = require('jquery');
var IbcScraper = (function () {
    function IbcScraper() {
    }
    IbcScraper.memoryVerses = function (req, res) {
        // let dom = new jsdom.JSDOM(``, {
        //     url: "http://chinese.islingtonbaptist.org.au/",
        //     contentType: "text/html",
        //     includeNodeLocations: true
        // });
        jsdom.JSDOM.fromURL("http://www.islingtonbaptist.org.au/media/memory-verses/", {}).then(function (dom) {
            var $ = require("jquery")(dom.window);
            // console.log($('img').toArray().map(elem => elem['src']));
            res.json({
                message: $('img[title*=Verse]').toArray().map(function (elem) { return elem['src']; })
            });
        });
    };
    return IbcScraper;
}());
exports.IbcScraper = IbcScraper;
