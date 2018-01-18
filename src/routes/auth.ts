import * as express from 'express';
import * as admin from 'firebase-admin';

import { User } from '../mongoose/user';

// import * as firebase from 'firebase';
// var admin = require("firebase-admin");
// import * as firebase from 'firebase';
var firebase = require("firebase");

var serviceAccount = require(`${process.env.HOME}/keys/ibc-app-94466-firebase-adminsdk-duh4r-7c081488cd.json`);

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

        // res.json(result);
        admin.auth().createCustomToken(`${result[0].id}`)
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
        })

        this.router.post('/', (req, res) => {

            let body = req.body;

            User.connect();
            User.model.find({ name: body.username, password: body.password || 'xxx' }, createAuthHandler(res));
        });
    }

}