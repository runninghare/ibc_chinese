import {User} from '../mongoose/user';
import * as fs from 'fs';

User.connect();

let user_data = require('../../jsons/ibc-app-94466-export.json');

User.model.find({}, (err, result) => {

    result = result.map(r => {
        return {
            "name": r.name,
            "password": r.password,
            "id": r.id,
            "email": r.email,
            "access_level": r.access_level,
        }
    });

    Object.keys(user_data.contacts).forEach(contactId => {
        let data = user_data.contacts[contactId];

        let db_data = result.filter(r => r.email == data.email)[0];

        if (!db_data) {
            console.error('--- missing match! ---');
            console.error(data);
        } else {
            data.username = db_data.name;
        }
    });

    console.log(JSON.stringify(user_data, null, 2));

    User.disconnect(() => {
        process.exit(0);
    });
});

// fs.writeFileSync("./jsons/export-data.json", JSON.stringify(user_data, null, 2));

// console.log(user_data);