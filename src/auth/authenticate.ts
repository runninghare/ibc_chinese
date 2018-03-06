var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
import {User} from '../mongoose/user';
import * as mongoose from 'mongoose';

// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
passport.use(new Strategy(
    (token, cb) => {
        User.connect();
        User.model.find({ id: token }, (err, user) => {
            if (err) { return cb(err); }
            if (!user || user.length == 0) { return cb(null, false); }
            return cb(null, user[0]);
        });
    }));


export const Passport = passport;