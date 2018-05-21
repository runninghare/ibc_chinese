import {User} from '../mongoose/user';
import {makeRandomString} from '../utils';
import {Telstra} from '../utils/telstra';
import {Auth} from '../utils/auth';
const argv = require( 'argv' );
const args = argv.option([
{
    name: 'confirm',
    short: 'c',
    type: 'boolean',
    description: 'Confirm to send SMS',
    example: "'script --confirm' or 'script -c'"
},
{
    name: 'users',
    short: 'u',
    type: 'csv,string',
    description: 'SMS recipients',
    example: "'script --users=rossz,jillzhang' or 'script -u'"
}
]).run();

let confirm = args.options.confirm;
let users = args.options.users;

if (!users) {
    console.log('You must use --users=user1,user2, or -u user1,user2 to specify SMS recipients!');
    process.exit(0);
}

import * as fs from 'fs';
import * as async from 'async';

import {FirebaseDB as db} from '../firebase';

let iosUrl = "https://itunes.apple.com/us/app/依斯靈頓中文教會/id1338517393?ls=1&mt=8";
let androidUrl = "https://play.google.com/store/apps/details?id=com.rjwebsolution.ibcchinese";

// let usernames = ['rossz', 'jillzhang', 'wilsonc', 'selinal', 'jackc', 'dawny', 'pauliney', 'amosl', 'marcol'];
// let usernames = ['rossz'];

User.connect();

function sendNotification(names: string[], calback?: Function) {

    let contacts: any[] = [];

    let telstra = new Telstra();

    db.ref(`/contacts`).once('value', snapshot => {
        let val = snapshot.val();

        if (val) {
            contacts = Object.keys(val).map(k => val[k]);
        }

        User.model.find({name: {$in: names}}, (err, result) => {

            let notifs = result.map(doc => {
                let contact = contacts.filter(c => c.email == doc.email)[0];

                return {
                    name: doc.name,
                    email: doc.email,
                    mobile: contact && contact.mobile,
                    password: doc.password
                }
            });

            notifs = notifs.filter(n => n.mobile && n.mobile.match(/^\d+$/))

            if (!confirm) {
                console.log('--- check before sending ---');
                console.log(notifs);
                User.disconnect(() => {
                    console.log('--- mongoose disconnected ---');
                    process.exit(0);
                });                  
            } else {
                Promise.all(
                    notifs.map(notif => telstra.sendSMS(notif.mobile,
    `這是一條依斯靈頓中文教會自動發送的短消息，請勿回復。

依斯靈頓中文教會APP已上線，可在Apple Store或Play Store中輸入「IBC Chinese」獲取。 現邀請您測試！

您的用戶名：${notif.name}
您的密碼：${notif.password}`
                    ))
                ).then(result => {
                    console.log(JSON.stringify(result, null, 2));
                    User.disconnect(() => {
                        console.log('--- mongoose disconnected ---');
                        process.exit(0);
                    });                
                }).catch(console.error);
            }
            // console.log(notifs);
        }); 

    }, error => {
    })
}

sendNotification(users);
