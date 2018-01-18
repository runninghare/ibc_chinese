var mongoose = require('mongoose');

export class IbcDB {

    constructor() {
        IbcDB.connect();
    }

    public static mongoose = mongoose;

    public static connect(): void {
        mongoose.connect('mongodb://localhost/ibc_chinese');
    }

    public static disconnect(cb?: Function): void {
        mongoose.disconnect(cb);
    }

    public static save(obj: any, cb: Function): void {
        IbcDB.connect();
        // db.once('open', function() {
        obj.save(function(err, obj) {
            if (err) cb(err, obj);
            if (cb) cb(null, obj);
        });
        // });
    }

    public static get db() {
        return mongoose.connection;
    }

}

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("=== we are connected! ===");
// });
