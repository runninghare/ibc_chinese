import * as express from 'express';
import * as admin from 'firebase-admin';
import { Passport } from '../auth/authenticate';

import { User } from '../mongoose/user';

// import * as firebase from 'firebase';
// var admin = require("firebase-admin");
// import * as firebase from 'firebase';
var firebase = require("firebase");

var serviceAccount = require(`../../jsons/ibc-app-94466-firebase-adminsdk-duh4r-4e0ae9fae6.json`);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ibc-app-94466.firebaseio.com"
});

let signInWithToken = (token:string, providerId): Promise<any> => {
    return firebase.auth().signInWithCustomToken(token);
    // return firebase.auth().signInWithCustomToken(token).then(() => {
    //     return firebase.auth().currentUser.linkWithCredential({providerId})
    // });
}

let createAuthHandler = function(res: express.Response, signInProviderId?: string) {
    return (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (!result || !result.length) {
            res.status(400).json({ error: 'no match' });
            return;
        }

        console.log(result);
        admin.auth().createCustomToken(`${result[0].id}`, {access_level: result[0].access_level})
            .then(function(token) {

                res.json({
                    token
                });

            })
            .catch(function(error) {
                res.status(400).json(error);
            });
    };

    // var user1 = new User({ name: 'user1', password: 'password' });
    // User.save(user1, function(err, result) {
    //     if (err) {
    //         res.json(err);
    //     }
    //     res.json(result);
    // });
};

export class Auth {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.post('/uid', (req, res) => {
            let uid = req.body && req.body.uid;

            admin.auth().getUser(uid)
                .then(userRecord => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    // console.log("Successfully fetched user data:", userRecord.toJSON());
                    
                    /* Delete the user if his uid is not from our DB */ 
                    if (!uid.match(/^ibc_/)) {
                        admin.auth().deleteUser(uid)
                            .then(function() {
                                console.log("Successfully deleted user");
                            })
                            .catch(function(error) {
                                console.log("Error deleting user:", error);
                            });
                    }

                    if (userRecord && userRecord.email) {
                        User.connect();
                        User.model.find({ email: userRecord.email }, createAuthHandler(res, uid));
                    }

                    console.log(userRecord);
                })
                .catch(error => {
                    console.log("Error fetching user data:", error);
                    res.json(error);
                });
        });

        this.router.post('/changepassword', (req, res) => {

            let body = req.body;

            if (!body.username || !body.oldpassword) {
                res.status(400).json({error: "you must provide username and oldpassword"});
                return;
            }

            if (!body.password1 || !body.password2 || body.password1 != body.password2) {
                res.status(400).json({error: "the new password is missing or your inputs do not match."});
                return;
            }

            User.connect();
            User.model.update({ name: body.username.toLowerCase(), password: body.oldpassword.toLowerCase() || 'xxx' }, {
                $set: { password: body.password1 }
            }, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }

                if (!result.n) {
                    res.status(400).json({error: "username and the old password do not match!"})
                } else if (!result.nModified) {
                    res.status(400).json({error: "You new password cannot be same as the old one!"})
                } else {
                    res.json({success: 1});
                }
                
            });
        });        

        this.router.post('/changeemail', Passport.authenticate('bearer', { session: false }), (req, res) => {

            let email = req.body.email;

            if (!email) {
                res.status(400).json({error: 'Body must contain "email" property.'})
                return;
            }

            let id = req['user'] && req['user'].id;

            User.model.update({ id }, {
                $set: { email }
            }, (err, result) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }

                if (!result.n) {
                    res.status(400).json({error: "Can't find the matching user!"})
                } else if (!result.nModified) {
                    res.json({success: 0})
                } else {
                    res.json({success: 1});
                }
                
            });            

        });         

        this.router.post('/', (req, res) => {

            let body = req.body;

            if (!body.username || !body.password) {
                res.status(400).json({error: "you must provide username and password"});
                return;
            }

            User.connect();
            User.model.find({ name: body.username.replace(/\s+/g,'').toLowerCase(), password: body.password.replace(/\s+/g,'').toLowerCase() || 'xxx' }, createAuthHandler(res));
        });
    }

}