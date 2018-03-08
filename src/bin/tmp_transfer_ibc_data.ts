import * as fs from 'fs';

let user_data = require('../../jsons/ibc-app-94466-export.json');

console.log(user_data);

user_data.userMap = {};
user_data.contacts = {};

Object.keys(user_data.users).forEach(k => {
    let v = user_data.users[k];
    user_data.userMap[k] = {
        contactId: v.id
    };
    user_data.contacts[v.id] = v;
});
user_data.users = undefined;

fs.writeFileSync("./jsons/export-data.json", JSON.stringify(user_data, null, 2));

console.log(user_data);