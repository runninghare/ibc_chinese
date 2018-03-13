import * as express from 'express'
import * as jsdom from 'jsdom'
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { JsDomRoute } from './routes/jsdom';
import { Auth } from './routes/auth';
import { FirebaseHandler } from './routes/firebase';
import { Express, Request, Response } from 'express';

import { Passport } from './auth/authenticate';
import * as cors from 'cors';

class App {
    public express: Express;

    constructor() {
        this.express = express();

        this.express.use(cors());

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
    }

    private mountRoutes(): void {
        const router = express.Router()
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            })
        })

        this.express.use('/', router);
        this.express.use('/jsdom', new JsDomRoute().router);
        this.express.use('/auth', new Auth().router);
        this.express.use('/firebase', Passport.authenticate('bearer', { session: false }), new FirebaseHandler().router);
    }
}

export default new App().express
