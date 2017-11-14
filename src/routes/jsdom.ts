import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';

export class JsDomRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get('/', (req, res) => {

            // let dom = new jsdom.JSDOM(``, {
            //     url: "http://chinese.islingtonbaptist.org.au/",
            //     contentType: "text/html",
            //     includeNodeLocations: true
            // });

            jsdom.JSDOM.fromURL("http://www.islingtonbaptist.org.au/media/memory-verses/", {}).then(dom => {

                const $ = require("jquery")(dom.window) as JQueryStatic;

                console.log($('img').toArray().map(elem => elem['src']));

                res.json({
                    message: $('img[title*=Verse]').toArray().map(elem => elem['src'])
                });
            });
        })
    }

}