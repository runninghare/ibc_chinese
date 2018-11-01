import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as moment from 'moment-timezone';
import {FirebaseDB as db} from '../firebase';

export class MinistryRendererRoute {

    public router: express.Router;

    ministryRoles = [
        { key: 'leader', caption: '主席', optionGetter: 'leaderCandidates' },
        { key: 'preacher', caption: '講員', optionGetter: 'preacherCandidates' },
        { key: 'interpreter', caption: '傳譯', optionGetter: 'interpreterCandidates' },
        { key: 'choir1', caption: '敬拜1', optionGetter: 'choirCandidates' },
        { key: 'choir2', caption: '敬拜2', optionGetter: 'choirCandidates' },
        { key: 'music1', caption: '司樂1', optionGetter: 'musicCandidates' },
        { key: 'music2', caption: '司樂2', optionGetter: 'musicCandidates' },
        { key: 'assistant1', caption: '司事1', optionGetter: 'assistantCandidates' },
        { key: 'assistant2', caption: '司事2', optionGetter: 'assistantCandidates' },
        { key: 'techanician', caption: '影音', optionGetter: 'techCandidates' },
        { key: 'morningtea', caption: '茶點', optionGetter: 'morningteaCandidates' },
        { key: 'communion1', caption: '襄禮1', optionGetter: 'communionCandidates' },
        { key: 'communion2', caption: '襄禮2', optionGetter: 'communionCandidates' },
    ];

    constructor() {
        this.router = express.Router();

        this.router.get('/', (req, res, next) => {
            Promise.all([
                db.ref("/ministries").once("value"),
                db.ref("/contacts").once("value")
            ]).then(snapshots => {
                let ministries = snapshots[0].val();
                let contacts = snapshots[1].val();

                ministries.forEach(m => {
                    m.date = moment(m.date).format('M月D日');
                    this.ministryRoles.forEach(role => {
                        if (m[role.key]) {
                            let contact = contacts[m[role.key]]
                            m[role.key] = {
                                name: `${contact.chinese_name} (${contact.name})`,
                                confirm: m.confirm && m.confirm[m[role.key]]
                            };
                            // m[role.key] = `${contact.chinese_name} (${contact.name})`;
                        }
                    });
                })
                res.render('ministry', {ministries, ministryRoles: this.ministryRoles});
            }, err => {
                res.status(500).json(err);
            });
        });
    }

}