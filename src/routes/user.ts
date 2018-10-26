import * as express from 'express';
import * as admin from 'firebase-admin';
import { Passport } from '../auth/authenticate';
import {makeRandomString} from '../utils';

import { User } from '../mongoose/user';

export class UserRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router(); 

        this.router.post('/', (req, res) => {

            let body = req.body;

            let cur_user = req['user'];

            if (cur_user.access_level < 3) {
                res.status(401).json({error: 'You don\'t have permission to do this operation'});
                return;
            }

            let name = body.name;
            let email = body.email;
            let access_level = body.access_level;

            if (!name || !email || !access_level) {
                res.status(401).json({error: 'You must provide "name", "email" and "access_level" properties.'});
                return;
            }

            let password = makeRandomString(8, true);
            let id = `ibc_${makeRandomString(8)}`;

            User.connect();
            User.insert({
                name,
                email,
                access_level,
                password,
                wechat: null
            }).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).json(err);
            });
            // User.model.find({ name: body.username.replace(/\s+/g,'').toLowerCase(), password: body.password.replace(/\s+/g,'').toLowerCase() || 'xxx' }, createAuthHandler(res));

            // res.json({ok: 1});
        });

        this.router.delete('/', (req, res) => {

            let body = req.body;
            let query = req.query;

            let cur_user = req['user'];

            if (cur_user.access_level < 5) {
                res.status(401).json({error: 'You don\'t have permission to do this operation'});
                return;
            }

            let name = body.name || query.name;

            if (!name) {
                res.status(401).json({error: 'You must provide "name" property.'});
                return;
            }

            User.connect();
            User.remove({
                name
            }).then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).json(err);
            });
            // User.model.find({ name: body.username.replace(/\s+/g,'').toLowerCase(), password: body.password.replace(/\s+/g,'').toLowerCase() || 'xxx' }, createAuthHandler(res));

            // res.json({ok: 1});
        });        
    }

}