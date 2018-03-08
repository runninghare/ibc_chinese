import * as express from 'express';
import * as admin from 'firebase-admin';

import {FirebaseDB as db} from '../firebase';
import {makeRandomString} from '../utils';

// var serviceAccount = require('../../jsons/ibc-app-94466-firebase-adminsdk-duh4r-4e0ae9fae6.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://ibc-app-94466.firebaseio.com"
// }, 'ibcchinese');

// var db = admin.database();
// var ref = db.ref("/kids").child(process.argv[2] || "0");

export class FirebaseHandler {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get('/user', (req, res, next) => {

            res.json(req['user']);

            // db.ref("/users").once("value").then((snapshot) => {
            //     res.json(snapshot.val());
            // }, err => {
            //     next(err);
            // });
        })

        this.router.post('/get_thread', (req, res, next) => {
            let my_uid = req['user'] && req['user'].id;

            if (req.body && req.body.receiver_id) {
                let receiver_id = req.body.receiver_id;
                db.ref("/users").once("value").then((snapshot) => {
                    let users = snapshot.val();
                    let receiver_uid = Object.keys(users).filter(uid => users[uid].id == receiver_id)[0];

                    if (receiver_id) {
                        Promise.all([
                            db.ref(`/threadMap/${my_uid}---${receiver_uid}`).once('value'),
                            db.ref(`/threadMap/${receiver_uid}---${my_uid}`).once('value')
                        ]).then(result => {
                            let thread = result[0].val() || result[1].val();
                            // console.log(thread);
                            if (thread) {
                                res.json({thread});
                            } else {
                                let new_thread_id = makeRandomString(10);
                                db.ref(`/threadMap/${my_uid}---${receiver_uid}`).set(new_thread_id).then(() => {
                                    res.json({ thread_id: new_thread_id });
                                }, err => {
                                    res.status(400).json(err);
                                })
                            }
                        }).catch(error => {
                            res.status(400).json({error});
                        })


                    } else {
                        res.status(400).json({error: "Failed to set new thread"});
                    }
                }, err => {
                    res.json(err);
                });                
            } else {
                res.status(400);
                res.end("You must post the receiver id via 'receiver_id' property");
            }
        })
    }

}