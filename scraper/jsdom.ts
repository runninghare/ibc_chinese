import * as express from 'express';
import {Request, Response} from "express";

const jsdom = require('jsdom');
const jquery = require('jquery');

export class IbcScraper {

    public static memoryVerses = (req: Request, res: Response) => {

        // let dom = new jsdom.JSDOM(``, {
        //     url: "http://chinese.islingtonbaptist.org.au/",
        //     contentType: "text/html",
        //     includeNodeLocations: true
        // });

        jsdom.JSDOM.fromURL("http://www.islingtonbaptist.org.au/media/memory-verses/", {}).then((dom) => {

            const $ = require("jquery")(dom.window);

            // console.log($('img').toArray().map(elem => elem['src']));

            res.json({
                message: $('img[title*=Verse]').toArray().map(elem => elem['src'])
            });
        });
    };

}