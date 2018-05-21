import {User} from '../mongoose/user';
import {makeRandomString} from '../utils';
import {Auth} from '../utils/auth';

import * as fs from 'fs';
import * as async from 'async';

// let usernames = ['rossz', 'jillzhang'];

User.connect();

User.model.find({}, (err, result) => {
    let usernames = result.map(r => r.name);

    Auth.updatePassword(usernames, function(err, result) {
        if (!err) {
            console.log('--- all done! ---');
            console.log(result);
        }

        User.disconnect(() => {
            console.log('--- mongoose disconnected ---');
            process.exit(0);
        });
    });    
});

