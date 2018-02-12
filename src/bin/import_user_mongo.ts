import {User} from '../mongoose/user';

let user_data = [
    { 
        name: 'wilsonc', 
        password: 'password', 
        id: 'ibc_Oere3fae7zu4r', 
        email: 'ioikos@gmail.com',
        access_level: 5
    },
    { 
        name: 'selinal', 
        password: 'password', 
        id: 'ibc_Gei4sooZ9daib', 
        email: 'yklchan@gmail.com',
        access_level: 5
    },
    { 
        name: 'jackc', 
        password: 'password', 
        id: 'ibc_PheemahK5ojei', 
        email: 'jhhcheng@netvigator.com',
        access_level: 1
    },
    { 
        name: 'dawny', 
        password: 'password', 
        id: 'ibc_am6thibaeL8eY', 
        email: 'dawnyeye@yahoo.com.hk',
        access_level: 1
    },
    { 
        name: 'keithJ', 
        password: 'password', 
        id: 'ibc_Fae0ooPaijos9', 
        email: 'keithj@unknown',
        access_level: 1
    }, 
    { 
        name: 'caroly', 
        password: 'password', 
        id: 'ibc_rool6ieT8Tee1', 
        email: '1139455487q@gmail.com',
        access_level: 1
    },
    { 
        name: 'lian', 
        password: 'password', 
        id: 'ibc_Quie7useca7yu', 
        email: 'lian@unknown',
        access_level: 1
    },
    { 
        name: 'amosl',
        password: 'password', 
        id: 'ibc_AeNgu7thaiTei', 
        email: 'lian@unknown',
        access_level: 1
    },    
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

