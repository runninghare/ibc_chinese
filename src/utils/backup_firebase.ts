import {FirebaseDB as db} from '../firebase';
import * as moment from 'moment';

var fs = require('fs');

export class BackupFB {

    constructor(public outdir: string = './firebase_backup') {
    }

    backup = () => {
        return db.ref('/').once('value').then(snapshot => {
            let data = snapshot.val();
            let timestamp = moment().format('YYYYMMDDHHmmss');

            return new Promise((resolve, reject) => {
                fs.writeFile(`${this.outdir}/${timestamp}`, JSON.stringify(data, null, 2), err => {
                    if (err) {
                        reject(err);
                    }
                    console.log(`Backup firebase at ${moment().format('DD/MM/YYYY HH:mm:ss')}`);
                    resolve(data);
                });
            })
        })
    }

    scheduler: NodeJS.Timer;

    backupScheduler(interval: number = 3600000) {
        this.backup().then(data => {
            this.scheduler = setTimeout(() => {
                this.backupScheduler(interval);
            }, interval)
        }, err => {
            console.error(err);
            this.scheduler = setTimeout(() => {
                this.backupScheduler(interval);
            }, interval)
        })
    }

    cancelBackupScheduler(): void {
        clearTimeout(this.scheduler);
    }

}