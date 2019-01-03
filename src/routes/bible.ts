import * as express from 'express';
import * as path from 'path';

export class BibleRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        console.log(__dirname);

        var knex = require('knex')({
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
                filename:  path.resolve(__dirname, '..', '..', 'bible.db')
            }
        });

        this.router.get('/', (req, res) => {
            // knex('Bible').select('*').limit(5)
            knex('Bible').innerJoin('BibleID', 'Bible.VolumeSN', 'BibleID.SN').where(req.query).select('*').limit(300)
            .then(data => {
                res.json(data);
            }, error => {
                res.status(400).json(error);
            });
        });

        this.router.get('/summary', (req, res) => {
            // knex('Bible').select('*').limit(5)
            knex('BibleID').where(req.query).select('*')
            .then(data => {
                res.json(data);
            }, error => {
                res.status(400).json(error);
            });
        });

        this.router.post('/search', (req, res) => {
            // knex('Bible').select('*').limit(5)
            let keyword = req.body['keyword'];
            if (!keyword) {
                res.status(400).json({Error: 'keyword missing!'});
            }
            let english = keyword.match(/[A-Za-z]/);
            knex('Bible').innerJoin('BibleID', 'Bible.VolumeSN', 'BibleID.SN').where(english?'English':'Chinese', 'like', `%${keyword}%`).select('*')
            .then(data => {
                res.json(data);
            }, error => {
                res.status(400).json(error);
            });
        });        
    }

}