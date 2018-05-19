import {User} from '../mongoose/user';
import {makeRandomString} from '../utils';

import * as fs from 'fs';
import * as async from 'async';

let usernames = ['rossz', 'jillzhang'];

interface IntCredential {
    name: string;
    password: string;
}

function updateCredential(credential: IntCredential, callback) {
    User.model.update({ name: credential.name }, { $set: { password: credential.password } }, callback);
}

export const Auth = {
    updatePassword: function(usernames: string[] = [], callback) {

        let credentials: IntCredential[] = usernames.map(u => {
            return { name: u, password: makeRandomString(6, true) }
        });

        async.map(
            credentials,
            updateCredential,
            function(err, result) {
                callback(err, credentials);
            }
        )
    }
}

// User.model.update({name: 'rossz'}, {$set: {password: 'aaaaaa'}}, (err, result) => {
//     console.log(result);

//     User.disconnect(() => {
//         console.log('--- mongoose disconnected ---');
//         process.exit(0);
//     });
// });