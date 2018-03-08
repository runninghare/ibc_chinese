import {User} from '../mongoose/user';
import * as fs from 'fs';

User.connect();

User.model.find({}, (err, result) => {
    console.log(result);

    fs.writeFileSync('jsons/export-data.json', JSON.stringify(result, null, 2));

    User.disconnect(() => {
        console.log('--- mongoose disconnected ---');
        process.exit(0);
    });
});