import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';

export class JsDomRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.post('/images', (req, res) => {

            let url = req.body.url;
            let pattern = req.body.pattern && new RegExp(req.body.pattern);
            let baseUrl = req.body.baseUrl;

            if (url) {
                jsdom.JSDOM.fromURL(url, {}).then(dom => {
                    const $ = require("jquery")(dom.window) as JQueryStatic;

                    let srcUrls = $('img').toArray().map(elem => elem['src']);
                    let targeUrls = srcUrls;

                    if (pattern) {
                        targeUrls = srcUrls.map(s => {
                            let matches = s.match(pattern);
                            return matches && matches[0];
                        });

                        if (baseUrl) {
                            targeUrls = targeUrls.map(s => baseUrl + s);
                        }
                    }

                    res.json({
                        images: targeUrls
                    });
                }, err => {
                    res.status(400).json(err);
                })
            } else {
                res.status(400).json({Error: 'Propty "url" must be provided'});
            }

            // let dom = new jsdom.JSDOM(``, {
            //     url: "http://chinese.islingtonbaptist.org.au/",
            //     contentType: "text/html",
            //     includeNodeLocations: true
            // });
            // 

            // jsdom.JSDOM.fromURL("http://www.islingtonbaptist.org.au/media/memory-verses/", {}).then(dom => {

            //     const $ = require("jquery")(dom.window) as JQueryStatic;

            //     console.log($('img').toArray().map(elem => elem['src']));

            //     res.json({
            //         message: $('img[title*=Verse]').toArray().map(elem => elem['src'])
            //     });
            // });
        })
    }

}