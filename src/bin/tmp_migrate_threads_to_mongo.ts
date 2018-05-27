import * as fs from 'fs';
import * as async from 'async';
import {Thread, IntMessage, IntThread} from '../mongoose/thread';
import {FirebaseDB as db} from '../firebase';

Thread.connect();

db.ref(`/threads`).once('value', snapshot => {
    let obj = snapshot.val();

    let allThreads: IntThread[] = [];

    Object.keys(obj).forEach(k => {
        let thread: IntThread = obj[k];
        console.log(k);
        console.log(JSON.stringify(thread, null, 2));
        thread.id = k;

        allThreads.push(thread);
    });

    Thread.model.insertMany(allThreads, function(err, result) {
        if (!err) {
            console.log("--- Threads migrated successfully! ---");
        } else {
            console.error("--- Error! ---");
        }

        Thread.disconnect(() => {
            console.log('--- mongoose disconnected ---');
            process.exit(0);
        });
    }
}