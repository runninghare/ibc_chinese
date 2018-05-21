import {User} from '../mongoose/user';
import * as fs from 'fs';

User.connect();

User.model.find({}, (err, result) => {
    console.log(result);

    result = result.map(r => {
        return {
            "name": r.name,
            "password": r.password,
            "id": r.id,
            "email": r.email,
            "access_level": r.access_level,
        }
    });

    fs.writeFileSync('jsons/export-auth.json', JSON.stringify(result, null, 2));

    User.disconnect(() => {
        console.log('--- mongoose disconnected ---');
        process.exit(0);
    });
});