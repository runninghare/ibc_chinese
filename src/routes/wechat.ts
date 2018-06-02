import * as express from 'express';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as request from 'request';
import { User } from '../mongoose/user';
import { Passport } from '../auth/authenticate';
import { createAuthHandler } from './auth';

const app = "wx89037f9e4c83dc79";
const app_secret = "955e60036f832584014d4877f89e38e1";

export interface IntWeChatAuth {
    openid: string;
    unionid: string;
    nickname: string;
    sex: number;
    language: string;
    city: string;
    province: string;
    country: string;
    headimgurl: string;
    privilege: any[];
}

export class WeChatRoute {

    public router: express.Router;

    wechatAuth(code: string): Promise<IntWeChatAuth> {
        return new Promise<IntWeChatAuth>((resolve, reject) => {
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
                                    resolve(userInfo);
                                } catch (e) {
                                    reject(e);
                                }
                            });
                    } catch (e) {
                        reject(e);
                    }
                });
        });
    }

    constructor() {
        this.router = express.Router();

        this.router.post('/login', (req, res) => {
            let code = req.body && req.body.code;

            this.wechatAuth(code).then(userInfo => {
                let openid = userInfo.openid;
                let unionid = userInfo.unionid;

                // res.json(userInfo);

                User.connect();
                User.model.find({ "wechat.openid": openid, "wechat.unionid": unionid }, (err,data) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        User.model.update({ "wechat.openid": openid, "wechat.unionid": unionid }, {
                            $set: { wechat: userInfo }
                        }, (err1, data1) => {
                            if (err1) {
                                res.status(500).json(err);
                            } else {
                                createAuthHandler(res)(err, data);
                            }
                        });
                    }
                });
            }).catch(err => {
                res.status(401).json(err);
            });
        });

        this.router.post('/associate', Passport.authenticate('bearer', { session: false }), (req, res) => {
            let code = req.body && req.body.code;
            let id = req['user'] && req['user'].id;

            this.wechatAuth(code).then(userInfo => {

                User.model.update({ id }, {
                    $set: { wechat: userInfo }
                }, (err, result) => {
                    if (err) {
                        res.status(500).json(err);
                        return;
                    }

                    if (!result.n) {
                        res.status(400).json({ error: "Can't find the matching user!" })
                    } else if (!result.nModified) {
                        res.json(userInfo)
                    } else {
                        res.json(userInfo);
                    }

                });
            }).catch(err => {
                res.status(401).json(err);
            });
        });        
    }

}