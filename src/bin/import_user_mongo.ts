import {User} from '../mongoose/user';

let user_data = [
    { 
        name: 'rossz', 
        password: 'password', 
        id: 'ibc_Leingie4oogit', 
        email: 'ross.yuexin.zhu@gmail.com',
        access_level: 5
    },
    { 
        name: 'jillzhang', 
        password: 'password', 
        id: 'ibc_Uweefae9Gaith', 
        email: 'zhangjingets7836@gmail.com',
        access_level: 1
    },
    { 
        name: 'ibcchurch', 
        password: 'password', 
        id: 'ibc_Tha1ieg6Xou0l', 
        email: 'chinese.islington@gmail.com',
        access_level: 1
    }
];

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

