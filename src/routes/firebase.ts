import * as express from 'express';
import * as admin from 'firebase-admin';
import * as moment from 'moment';

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

    errorHandler(res) {
        return error => {
            res.status(400);
            res.json({error});
        }
    }

    constructor() {
        this.router = express.Router();

        this.router.get('/user', (req, res, next) => {

            res.json(req['user']);

            // db.ref("/contacts").once("value").then((snapshot) => {
            //     res.json(snapshot.val());
            // }, err => {
            //     next(err);
            // });
        })

        this.router.post('/update_cache', (req, res, next) => {
            db.ref(`/updateCaches`).once('value', snapshot => {
                let val = snapshot.val();
                val.forEach(v => {
                    v.timestamp = moment().format('YYYY-MM-DD');
                })
                db.ref(`/updateCaches`).set(val).then(result => {
                    res.json(val);
                })
            }, error => {
                res.status(500).json(error);
            })
        });

        this.router.post('/clear_notifications', (req, res, next) => {
            let myUid = req['user'] && req['user'].id;

            db.ref(`/userMap/${myUid}/contactId`).once('value').then(myContactId => {
                db.ref(`tasks/${myContactId}`).remove().then(() => {
                    res.json({ok: 200});
                });
            })


            // db.ref(`/contacts`).once('value', snapshot => {
            //     let contacts = snapshot.val();
            //     Object.keys(contacts).forEach(k => {
            //         let c = contacts[k];
            //         c.tasks = [];
            //     });
            //     db.ref(`/contacts`).set(contacts).then(result => {
            //         res.json(contacts);
            //     })
            // });
        });

        this.router.post('/thread_with', (req, res, next) => {
            let myUid = req['user'] && req['user'].id;
            let receiverId = req.body && req.body.receiver_id;

            if (!receiverId) {
                res.status(400);
                res.json({error: "You must post the receiver id via 'receiver_id' property"});
                return;
            }

            Promise.all([
               db.ref(`/userMap/${myUid}/contactId`).once('value'),
               db.ref(`/threads`).once('value'),
               db.ref(`/contacts`).once('value')
            ])
            .then(snapshots => {
                let myContactId = snapshots[0].val();
                let threads = snapshots[1].val();
                let contacts = snapshots[2].val();

                if (contacts && Object.keys(contacts).indexOf(`${receiverId}`) > -1) {
                    let threadKey = null;
                    let thread = null;
                    
                    if (threads) {
                        /* First we search the private conversations */
                        Object.keys(threads).forEach(k => {
                            let val = threads[k];
                            if (val.type == 'private' && val.participants[myContactId] && val.participants[receiverId]) {
                                threadKey = k;
                                thread = threads[k];
                            }
                        });

                        /* Then we search group chat */
                        if (!threadKey) {
                            Object.keys(threads).forEach(k => {
                                let val = threads[k];
                                if (val.type == 'public' && val.participants[receiverId]) {
                                    threadKey = k;
                                    thread = threads[k];
                                }
                            });
                        }
                    }

                    if (threadKey) {
                        if (thread && thread.type == "public") {
                            db.ref(`/threads/${threadKey}/participants/${myContactId}`).set(1).then(() => {
                                res.json({ result: threadKey })
                                return;
                            }).catch(this.errorHandler(res));
                        } else {
                            res.json({result: threadKey});
                        }
                    } else {
                        let newThreadId = makeRandomString(10);
                        db.ref(`/threads/${newThreadId}`).set({
                            type: contacts[receiverId].class == 'group' ? 'public' : 'private',
                            participants: {
                              [myContactId]: 1,
                              [receiverId]: 1
                            }
                        }).then(() => {
                            res.json({result: newThreadId})
                            return;
                        }).catch(this.errorHandler(res));
                    }
                } else {
                    res.status(400);
                    res.json({error: `Cannot find the contact ${receiverId}!`});
                }

            },this.errorHandler(res))

/*            if (req.body && req.body.receiver_id) {
                let receiver_id = req.body.receiver_id;
                res.json({uid: my_uid});
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
            }*/
        })
    }

}