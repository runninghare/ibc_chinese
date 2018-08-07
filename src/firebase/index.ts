import * as express from 'express';
import * as admin from 'firebase-admin';
require('dotenv').config();

var serviceAccount = require('../../jsons/ibc-app-94466-firebase-adminsdk-duh4r-4e0ae9fae6.json');

let app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB
}, 'ibcchinese');

export const FirebaseDB = admin.database(app);