import * as express from 'express';
import * as admin from 'firebase-admin';

var serviceAccount = require('../../jsons/ibc-app-94466-firebase-adminsdk-duh4r-4e0ae9fae6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ibc-app-94466.firebaseio.com"
}, 'ibcchinese');

export const FirebaseDB = admin.database();