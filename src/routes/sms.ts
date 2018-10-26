import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as request from 'request';
import { User } from '../mongoose/user';
import { Passport } from '../auth/authenticate';
import { createAuthHandler } from './auth';
import * as Mustache from 'mustache';
import {FirebaseDB as db} from '../firebase';
import {makeRandomString} from '../utils';
import {Telstra} from '../utils/telstra';

export class SMSRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        let telstra = new Telstra();

        this.router.post('/send_reset_password', (req, res, next) => {
            let body = req.body && req.body;
            let cur_user = req['user'];

            if (cur_user.access_level < 3) {
                res.status(401).json({error: 'You don\'t have permission to do this operation'});
                return;
            }

            let users = body.users;
            let sendSms = body.send_sms;

            if (!users || !users.length) {
                res.status(400).json({error: 'You must provide at least 1 user in "users" property'});
                return;
            }

            db.ref("/contacts").once("value").then((snapshot) => {
                let contacts = snapshot.val();
                let userDetails = [];

                let telstra = new Telstra();

                users.forEach(userId => {
                    let contact = contacts[userId];
                    if (!contact) {
                        contact = Object.keys(contacts).map(k => contacts[k]).filter(c => c.username == userId)[0];
                    }
                    userDetails.push(contact);
                });

                Promise.all(userDetails.map(user => {
                    let newPassword = makeRandomString(8, true);
                    return User.model.update({ name: user.username.toLowerCase() }, {
                        $set: { password: newPassword }
                    }).then(res => {
                        if (res && res.nModified && user.mobile) {
                            if (sendSms) {
                                return telstra.sendSMS(user.mobile, Mustache.render(body && body.template ||
`您好，您的依斯靈頓中文教會APP密碼已重置。
用戶名：{{username}}
新密碼：{{password}}, 請盡快登錄後修改`, Object.assign({}, user, {password: newPassword}))).then(res => {
                                    return {ok: 1, username: user.username, password: newPassword, smsRes: res};
                                });
                            } else {
                                return {ok: 1, username: user.username, password: newPassword};
                            }
                        } else {
                            return {error: 1, username: user.username};
                        }
                    });
                })).then(result => {
                    res.json(result);
                }).catch(err => {
                    res.status(500).json(err);
                })

            }, err => {
                res.status(500).json(err);
            });
        });

        this.router.post('/send_sms', (req, res, next) => {
            let body = req.body && req.body;
            let cur_user = req['user'];

            if (cur_user.access_level < 3) {
                res.status(401).json({error: 'You don\'t have permission to do this operation'});
                return;
            }

            let users = body.users;
            let template = body.template;

            if (!users || !users.length) {
                res.status(400).json({error: 'You must provide at least 1 user in "users" property'});
                return;
            }

            if (!template) {
                res.status(400).json({error: 'You must provide the "template" property'});
                return;
            }

            db.ref("/contacts").once("value").then((snapshot) => {
                let contacts = snapshot.val();
                let userDetails = [];

                let telstra = new Telstra();

                users.forEach(userId => {
                    let contact = contacts[userId];
                    if (!contact) {
                        contact = Object.keys(contacts).map(k => contacts[k]).filter(c => c.username == userId)[0];
                    }
                    userDetails.push(contact);
                });

                Promise.all(userDetails.map(user => {
                    return telstra.sendSMS(user.mobile, Mustache.render(template, user));
                })).then(result => {
                    res.json(result);
                });
            }).catch(err => {
                res.status(500).json(err);
            });   
        });
    }

}