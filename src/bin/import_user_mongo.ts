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
    },
    { 
        name: 'chrisb', 
        password: 'password', 
        id: 'ibc_Heequii3Fooh9', 
        email: 'chris@imaginenowit.com.au',
        access_level: 1
    },
    { 
        name: 'sophiab', 
        password: 'password', 
        id: 'ibc_ohr3yae0aph7E', 
        email: 'sophzhiping@gmail.com',
        access_level: 1
    },
    { 
        name: 'billc', 
        password: 'password', 
        id: 'ibc_weingaethooH5', 
        email: 'billc@unknown',
        access_level: 1
    }, 
    { 
        name: 'shuiyin', 
        password: 'password', 
        id: 'ibc_Aeghaquiesh0c', 
        email: 'shuiyin@unknown',
        access_level: 1
    },
    { 
        name: 'shelleyc', 
        password: 'password', 
        id: 'iDa7sa2fegeip', 
        email: 'Shlleycun15@gmail.com',
        access_level: 1
    },
    { 
        name: 'khalil', 
        password: 'password', 
        id: 'piShoongieV0u', 
        email: 'kemseis@yahoo.com.au',
        access_level: 1
    },
    { 
        name: 'wengm', 
        password: 'password', 
        id: 'lohwei7Teaghe', 
        email: 'fong94522004@yahoo.com.hk',
        access_level: 1
    },
    { 
        name: 'francisf', 
        password: 'password', 
        id: 'eishah0bohToh', 
        email: 'francisf@unknown',
        access_level: 1
    },
    { 
        name: 'susanac', 
        password: 'password', 
        id: 'oxi9Ahqu1muQu', 
        email: 'susanac@unknown',
        access_level: 1
    },
    { 
        name: 'huih', 
        password: 'password', 
        id: 'TaidahPhee4si', 
        email: 'Hannahhuihe@gmail.com',
        access_level: 1
    },
    { 
        name: 'amyy', 
        password: 'password', 
        id: 'suhoo7Peeng7u', 
        email: 'yili516@hotmail.com',
        access_level: 1
    },
    { 
        name: 'ansonh', 
        password: 'password', 
        id: 'CheiCoo0ari5u', 
        email: 'anson-he66@hotmail.com',
        access_level: 1
    },
    { 
        name: 'kikeyz', 
        password: 'password', 
        id: 'othoh9Eezoiqu', 
        email: 'ki_chung59@hotmail.com',
        access_level: 1
    },
    { 
        name: 'maosheng', 
        password: 'password', 
        id: 'mai1eD4iesaSi', 
        email: 'maosheng@unknown',
        access_level: 1
    },
    { 
        name: 'liange', 
        password: 'password', 
        id: 'Ahdae4ooxoh4m', 
        email: 'liange@unknown',
        access_level: 1
    },
    { 
        name: 'helena', 
        password: 'password', 
        id: 'aeK2Eathei9Ti', 
        email: 'helena@unknown',
        access_level: 1
    }, 
    { 
        name: 'jamesh', 
        password: 'password', 
        id: 'ihaey3aB1ziem', 
        email: 'jamesh@unknown',
        access_level: 1
    },  
    { 
        name: 'estherk', 
        password: 'password', 
        id: 'sheip5mahC5so', 
        email: 'fafakam@hotmail.com',
        access_level: 1
    },  
    { 
        name: 'davidk', 
        password: 'password', 
        id: 'ethaileNg8bai', 
        email: 'kkmdavid123@gmail.com',
        access_level: 1
    },  
    { 
        name: 'mandyl', 
        password: 'password', 
        id: 'Oos0quiefeo8o', 
        email: 'mandy-lam@live.com.au',
        access_level: 1
    },  
    { 
        name: 'vincyl', 
        password: 'password', 
        id: 'aef8fiR2Uo4oh', 
        email: 'wingsinlau@yahoo.com.hk',
        access_level: 1
    },  
    { 
        name: 'peggyl', 
        password: 'password', 
        id: 'aenofu7shieYi', 
        email: 'peggyl@unknown',
        access_level: 1
    },  
    { 
        name: 'paulal', 
        password: 'password', 
        id: 'ohchood8cheMi', 
        email: 'pyu2@msn.com',
        access_level: 1
    },  
    { 
        name: 'bonniel', 
        password: 'password', 
        id: 'Theitihiep4va', 
        email: 'bonniel@unknown',
        access_level: 1
    }, 
    { 
        name: 'marcol', 
        password: 'password', 
        id: 'lab3uuNgeexib', 
        email: 'marcodbl@gmail.com',
        access_level: 1
    },
    { 
        name: 'aiping', 
        password: 'password', 
        id: 'uChoangouK5Me', 
        email: 'aiping@unknown',
        access_level: 1
    },
    { 
        name: 'jenniferl', 
        password: 'password', 
        id: 'xoo4jor1Gohwi', 
        email: 'liyuhong1238@163.com',
        access_level: 1
    },
    { 
        name: 'linl', 
        password: 'password', 
        id: 'woutahLu0phu0', 
        email: 'linli353@gamil.com',
        access_level: 1
    },
    { 
        name: 'zhenwul', 
        password: 'password', 
        id: 'aodain4jieVaj', 
        email: 'zhenwu@unknown',
        access_level: 1
    },
    { 
        name: 'shuhuij', 
        password: 'password', 
        id: 'aeyi9OoX9cahf', 
        email: 'shuhuij@unknown',
        access_level: 1
    },
    { 
        name: 'terrym', 
        password: 'password', 
        id: 'Eizah2IGoh3ge', 
        email: 'tiezhengma@hotmail.com',
        access_level: 1
    },
    { 
        name: 'michellel', 
        password: 'password', 
        id: 'sioThoh5gahti', 
        email: 'michelle@unknown',
        access_level: 1
    },
    { 
        name: 'natm', 
        password: 'password', 
        id: 'ahWee7Ahghoo5', 
        email: 'natm@unknown',
        access_level: 1
    }, 
    { 
        name: 'belindap', 
        password: 'password', 
        id: 'oothahph5oe6S', 
        email: 'phuabp@gmail.com',
        access_level: 1
    },
    { 
        name: 'lisas', 
        password: 'password', 
        id: 'Gaivehuo6Wuto', 
        email: 'lisashang62@gmail.com',
        access_level: 1
    },
    { 
        name: 'nancys', 
        password: 'password', 
        id: 'Ahcheij1fohl1', 
        email: 'nancys@unknown',
        access_level: 1
    },
    { 
        name: 'wenqiangs', 
        password: 'password', 
        id: 'uuzahtai3iu9I', 
        email: 'wenqiangs@unknown',
        access_level: 1
    },
    { 
        name: 'frankt', 
        password: 'password', 
        id: 'RoK5gie0taiwa', 
        email: 'frank12310@hotmail.com.hk',
        access_level: 1
    },
    { 
        name: 'pauliney', 
        password: 'password', 
        id: 'rohGheid9epho', 
        email: 'pauliney0122@gmail.com',
        access_level: 1
    },
    { 
        name: 'forrestt', 
        password: 'password', 
        id: 'udux0Eeh9vooX', 
        email: 'forrestt@unknown',
        access_level: 1
    },
    { 
        name: 'lydiaw', 
        password: 'password', 
        id: 'gachain4ap0Ei', 
        email: 'lydiaw@unknown',
        access_level: 1
    },
    { 
        name: 'zozow', 
        password: 'password', 
        id: 'ooY8hahwua4za', 
        email: 'zozow@unknown',
        access_level: 1
    },
    { 
        name: 'aaronw', 
        password: 'password', 
        id: 'la8CooxeeCieN', 
        email: 'aaron.wong@live.com.au',
        access_level: 1
    },
    { 
        name: 'angelw', 
        password: 'password', 
        id: 'gi9EChekahphu', 
        email: 'boey4u@hotmail.com',
        access_level: 1
    },
    { 
        name: 'ningw', 
        password: 'password', 
        id: 'zooF4ye4Chooz', 
        email: 'wongning5945@hotmail.com',
        access_level: 1
    },
    { 
        name: 'jingr', 
        password: 'password', 
        id: 'einoo8aiphahF', 
        email: 'jing-r@hotmail.com',
        access_level: 1
    },
    { 
        name: 'jackw', 
        password: 'password', 
        id: 'eNge2maW1thib', 
        email: 'Jack.wow@gmail.com',
        access_level: 1
    },
    { 
        name: 'ceciliaz', 
        password: 'password', 
        id: 'aeZ7kaghi4euj', 
        email: 'ceciliaz@unknown',
        access_level: 1
    },
    { 
        name: 'jimx', 
        password: 'password', 
        id: 'aizah5Wee4eSh', 
        email: 'jimx@unknown',
        access_level: 1
    },
    { 
        name: 'adap', 
        password: 'password', 
        id: 'jeeRiquim8Ai0', 
        email: 'adap@unknown',
        access_level: 1
    },
    { 
        name: 'hannahy', 
        password: 'password', 
        id: 'Air2EishaaSho', 
        email: 'hannahy@unknown',
        access_level: 1
    },
    { 
        name: 'yulil', 
        password: 'password', 
        id: 'phohqu1uguNei', 
        email: 'yulilai0820@gmail.com ',
        access_level: 1
    },
    { 
        name: 'huataiz', 
        password: 'password', 
        id: 'ievae2Queetee', 
        email: 'huataiz@unknown',
        access_level: 1
    },
    { 
        name: 'felixz', 
        password: 'password', 
        id: 'xahSaehik8aiR', 
        email: 'zwjcycing@163.com',
        access_level: 1
    },
    { 
        name: 'hongyuz', 
        password: 'password', 
        id: 'pheMoo5phee7z', 
        email: 'hongyujohn@hotmail.com',
        access_level: 1
    },
    { 
        name: 'jeanz', 
        password: 'password', 
        id: 'fia4Shei5Ohng', 
        email: 'yuhongjean@gmail.com"',
        access_level: 1
    },
    { 
        name: 'huiz', 
        password: 'password', 
        id: 'Oopei6iec9quu', 
        email: '1959559064@qq.com',
        access_level: 1
    },
    { 
        name: 'lianz', 
        password: 'password', 
        id: 'EeG7ciefei5Ie', 
        email: 'lianz@unknown',
        access_level: 1
    },
    { 
        name: 'zacharyz', 
        password: 'password', 
        id: 'ooReb1phee8Ju', 
        email: 'happyandrelax@gmail.com',
        access_level: 1
    },
    { 
        name: 'jillzz', 
        password: 'password', 
        id: 'Eimoox7seo6Uu', 
        email: 'happyandrelax@gmail.com',
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

