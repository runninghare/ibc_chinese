var mongoose = require('mongoose');

export class IbcDB {

    constructor() {
        IbcDB.connect();
    }

    public static mongoose = mongoose;

    public static connect(): void {
        mongoose.connect('mongodb://ibc:ibc@localhost/ibc_chinese');
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

    public static read<T>(query: any): Promise<T[]> {
        // const child_constructor = this.constructor as typeof IbcDB;

        return new Promise<T[]>((resolve, reject) => {
            (this as any).model.find(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    public static insert<T>(data: any): Promise<T[]> {
        // const child_constructor = this.constructor as typeof IbcDB;

        return new Promise<T[]>((resolve, reject) => {
            (this as any).model.create(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    public static update<T>(query: any, body: any): Promise<T[]> {
        // const child_constructor = this.constructor as typeof IbcDB;

        return new Promise<T[]>((resolve, reject) => {
            (this as any).model.update(query, body, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    public static remove<T>(query: any): Promise<T[]> {
        // const child_constructor = this.constructor as typeof IbcDB;

        return new Promise<T[]>((resolve, reject) => {
            (this as any).model.remove(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

}

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("=== we are connected! ===");
// });
