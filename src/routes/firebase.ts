import * as express from 'express';
import * as admin from 'firebase-admin';
import * as moment from 'moment';

import {FirebaseDB as db} from '../firebase';
import {makeRandomString} from '../utils';
import {Thread, IntThread, IntMessage} from '../mongoose/thread';

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
               // db.ref(`/threads`).once('value'),
               Thread.read<IntThread>({}),
               db.ref(`/contacts`).once('value'),
               db.ref(`/threads`).once('value')
            ])
            .then(snapshots => {
                let myContactId = snapshots[0].val();

                // console.log(`myUid = ${myUid}, receiverId = ${receiverId}`);

                if (!myContactId) {
                    throw("Failed to retrieve sender Id from the uid token.");
                    // res.status(500).json({Error: "Failed to retrieve sender Id from the uid token."});
                }

                if (myContactId == receiverId) {
                    throw("Sender and receiver must be different!");
                    // res.status(400).json({Error: "sender and receiver must be different!"});
                }

                let contacts = snapshots[2].val();
                // let threads = snapshots[1].val();
                let threads_array = snapshots[1];
                let threads = {};
                if (threads_array) {
                    threads_array.forEach(t => {
                        threads[t.id] = t;
                    });
                }
                let firebase_threads = snapshots[3].val();

                // Thread.getThreads({}).then(result => {
                //     res.json(result);
                // }).catch(err => {
                //     res.status(400).json(err);
                // });

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
                                res.json({ result: threadKey, thread })
                                return;
                            }).catch(this.errorHandler(res));
                        } else {
                            res.json({result: threadKey, thread});
                        }
                    } else {

                        /* Make sure there are no matching threads in firebase as well, otherwise
                        we have to eliminate them because DB is the first-hand data source */

                        let obsolete_keys = [];
                        Object.keys(firebase_threads).forEach(k => {
                            let val = firebase_threads[k];
                            if ((val.type == 'private' && 
                                val.participants[myContactId] && val.participants[receiverId]) ||
                                (val.type == 'public' && val.participants[receiverId])) {
                                obsolete_keys.push(k);
                            }
                        });


                        obsolete_keys.forEach(k => {
                            db.ref(`threads/${k}`).remove();
                        });

                        // res.json(firebase_threads);
                        // res.json(obsolete_keys);

                        let newThreadId = makeRandomString(10);
                        let newThread = {
                            type: contacts[receiverId].class == 'group' ? 'public' : 'private',
                            participants: {
                              [myContactId]: 1,
                              [receiverId]: 1
                            }
                        };

                        db.ref(`/threads/${newThreadId}`).set(newThread)
                            .then(res => {
                                // console.log(`--- firebase inserted: ${newThreadId} ---`);
                                return Thread.insert(Object.assign({},newThread, {id: newThreadId}));
                            })
                            .then(() => {
                                res.json({result: newThreadId, thread: newThread})
                                return;
                            }).catch(err => {
                                console.log('err occurred!');
                                console.log(err);
                                this.errorHandler(res);
                            });
                    }
                } else {
                    res.status(400);
                    res.json({error: `Cannot find the contact ${receiverId}!`});
                }

            }).catch(this.errorHandler(res));

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
        });

        this.router.post('/thread_add_msg', (req, res, next) => {
            let myUid = req['user'] && req['user'].id;
            let threadId = req.body && req.body.thread_id;
            let message: IntMessage = req.body && req.body.message;

            if (!threadId || !message) {
                res.status(400);
                res.json({error: "You must provide threadId and message body"});
                return;
            }

            Promise.all([
               db.ref(`/userMap/${myUid}/contactId`).once('value'),
               Thread.read<IntThread>({id: threadId})
            ]).then(data => {
                let myContactId = data && data[0].val();
                let threads = data && data[1];

                message.sender = `${myContactId}`;
                message.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

                if (threads && threads.length > 0) {
                    let thread = threads[0];
                    thread.messages.push(message);

                    let fb_thread = {
                        participants: thread.participants,
                        messages: thread.messages.map(m => {
                            return {
                                body: m.body,
                                sender: `${m.sender}`,
                                timestamp: m.timestamp
                            };
                        }),
                        type: thread.type
                    };

                    // res.json(thread.messages);

                    // Firebase only store the most recent message
                    // Mongo stores all messages
                    // 
                    Promise.all([
                        db.ref(`/threads/${threadId}/messages`).set([message]),
                        Thread.update({id: threadId}, {$set: {messages: thread.messages}})
                    ]).then(result => {
                        res.json(message);
                    });
                }
            });
        });
    }

}