 
import {IbcDB} from './base';

var UserSchema = IbcDB.mongoose.Schema({
    id: String,
    name: String,
    password: String,
    email: String,
    access_level: Number
});

UserSchema.index({ name: 1 }, { unique: true });

export class User extends IbcDB {

    public static model = IbcDB.mongoose.model('User', UserSchema);

    constructor(data: any) {
        super();
        return User.model(data);
    }
}

// var User = conn.mongoose.model('User', UserSchema);
// export default User;
