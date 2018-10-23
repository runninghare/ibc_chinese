import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';

export class HomeRendererRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get('/', (req, res) => {
            res.render('home', {title: 'Islington Baptist Church (Chinese) - Management Page'});
        });
    }

}