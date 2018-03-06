import {User} from '../mongoose/user';
import * as mongoose from 'mongoose';
let user_data = require('../../jsons/export-auth.json');

// User.connect();

let users = user_data.map(d => new User(d));

// var user1 = new User({ name: 'user3', password: 'password' });
// User.save(user1, function(err, result) {
//     console.log('--- result ---');
//     if (err) {
//         console.error(JSON.stringify(err));
//     }
//     console.log(result);
//     User.disconnect(() => {
//         console.log('--- mongoose disconnected ---');
//         process.exit(0);
//     });
// });

// mongoose.connection.db.dropCollection('users', function(err, result) {...});
// 

User.model.remove({}, (err, result) => {
    User.model.insertMany(users, function(err, result) {
        console.log('--- result ---');
        if (err) {
            console.error(JSON.stringify(err));
        }
        console.log(result);
        User.disconnect(() => {
            console.log('--- mongoose disconnected ---');
            process.exit(0);
        });
    });
});



