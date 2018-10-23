import * as express from 'express'
import * as jsdom from 'jsdom'
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { JsDomRoute } from './routes/jsdom';
import { Auth } from './routes/auth';
import { WeChatRoute } from './routes/wechat';
import { FirebaseHandler } from './routes/firebase';
import { SMSRoute } from './routes/sms';
import { Express, Request, Response } from 'express';

import { HomeRendererRoute } from './renderers/home';
import { MinistryRendererRoute } from './renderers/ministry';

import { Passport } from './auth/authenticate';
import * as cors from 'cors';
import * as frameguard from 'frameguard';
// const frameguard = require('frameguard')
import * as exphbs from 'express-handlebars';
// var exphbs  = require('express-handlebars');

class App {
    public express: Express;

    constructor() {
        this.express = express();

        this.express.use(cors());

        this.express.use(frameguard({
            action: 'allow-from',
            domain: 'http://ibc.medocs.com.au'
        }));

        // this.express.use((req, res, next) => {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        //     next();
        // });

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());

        this.mountRoutes();
        this.mountRenderers();
    }

    private mountRoutes(): void {
        // const router = express.Router()
        // router.get('/', (req, res) => {
        //     res.json({
        //         message: 'Hello World!'
        //     })
        // })

        // this.express.use('/', router);
        this.express.use('/jsdom', new JsDomRoute().router);
        this.express.use('/auth', new Auth().router);
        this.express.use('/wechat', new WeChatRoute().router);
        this.express.use('/firebase', Passport.authenticate('bearer', { session: false }), new FirebaseHandler().router);
        this.express.use('/sms', Passport.authenticate('bearer', { session: false }), new SMSRoute().router);
    }

    private mountRenderers(): void {
        let hbs = exphbs.create({
            defaultLayout: 'main',
            // Specify helpers which are only registered on this instance.
            helpers: {
                foo: function() { return 'FOO!'; },
                bar: function() { return 'BAR!'; }
            }
        });

        this.express.engine('handlebars', hbs.engine);
        this.express.set('view engine', 'handlebars');

        this.express.use('/', new HomeRendererRoute().router);
        this.express.use('/ministry', new MinistryRendererRoute().router);
    }
}

export default new App().express
