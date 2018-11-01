import * as express from 'express';
import * as admin from 'firebase-admin';
import { Passport } from '../auth/authenticate';
import {makeRandomString} from '../utils';
import {FirebaseDB as db} from '../firebase';

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

            let name: string = body.name;
            let email: string = body.email;
            let access_level: number = body.access_level;

            if (!name || !email || !access_level) {
                res.status(401).json({error: 'You must provide "name", "email" and "access_level" properties.'});
                return;
            }

            let password = makeRandomString(8, true);
            let id = `ibc_${makeRandomString(8)}`;

            User.connect();
            User.read({name: name.toLowerCase()})
            .then(result => {
                let existing = result[0];
                if (existing) {
                    throw({error: `User with name ${name} already exists!`});
                } else {
                    return null;
                }
            })
            .then(res => {
                return User.insert({
                    id,
                    name: name.toLowerCase(),
                    email: email.toLowerCase(),
                    access_level,
                    password,
                    wechat: null
                })
            })
            .then(res => {
                return db.ref(`/contacts`).once('value').then(snapshot => {
                    let contacts = snapshot.val();
                    if (contacts) {
                        Object.keys(contacts).forEach(id => {
                            if (contacts[id].username == res['name']) {
                                console.log(`ADD USER: ${JSON.stringify(contacts[id])}`);
                                res['contactId'] = id;
                            }
                        })
                    }

                    if (res['contactId']) {
                        return db.ref(`/userMap`).child(id).child('contactId').set(res['contactId']).then(result => {
                            return res;
                        })
                    } else {
                        return res;
                    }
                })
            })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
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
            User.read({name}).then(result => {
                let user = result && result[0];
                if (user && user['id']) {
                    console.log(`DELETE USER: ${JSON.stringify(result)}`);
                    return db.ref(`/userMap`).child(user['id']).remove();
                } else {
                    return null;
                }
            })            
            .then(result => {
                return User.remove({name});
            })
            .then(result => {
                res.json(result);
            }).catch(err => {
                res.status(500).json(err);
            });
            // User.model.find({ name: body.username.replace(/\s+/g,'').toLowerCase(), password: body.password.replace(/\s+/g,'').toLowerCase() || 'xxx' }, createAuthHandler(res));

            // res.json({ok: 1});
        });        
    }

}