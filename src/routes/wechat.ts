import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as request from 'request';

const app = "wx89037f9e4c83dc79";
const app_secret = "955e60036f832584014d4877f89e38e1";

export class WeChatRoute {

    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.post('/login', (req, res) => {
            let code = req.body && req.body.code;

            request.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${app}&secret=${app_secret}&code=${code}&grant_type=authorization_code`,
                   (err, response, body) => {
                       try {
                           let data = JSON.parse(body);
                           let openid = data.openid;
                           let access_token = data.access_token;

                           request.get(`https://api.weixin.qq.com/sns/userinfo?openid=${openid}&access_token=${access_token}&lang=zh_CN`,
                               (err2, response2, body2) => {
                                   try {
                                       let userInfo = JSON.parse(body2);
                                       res.json(userInfo);
                                   } catch (e) {
                                       res.status(401).json({error: "Auth failed!"});
                                   }
                               });

                           // res.json({openid, access_token});
                       } catch (e) {
                           res.status(401).json({error: "Auth failed!"});
                       }
                   });
        });
    }

}