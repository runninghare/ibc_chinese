import * as express from 'express';
const TelstraMessaging = require('Telstra_Messaging');

// Obtain these keys from the Telstra Developer Portal 
const CONSUMER_KEY = "uvKsVAbRmLnCwoJOgeo6yewqmoDZv5xK";
const CONSUMER_SECRET = "x25ydSOMI1x1k6pU";
const GRANT_TYPE = 'client_credentials';
 
// Scope should contain a list of required APIs, seperated by a space (0x20). 

export class Telstra {

    telstraApi = new TelstraMessaging.AuthenticationApi();

    defaultClient = TelstraMessaging.ApiClient.instance;

    constructor() {
    }

    getAuth(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.telstraApi.authToken(CONSUMER_KEY, CONSUMER_SECRET, GRANT_TYPE, (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    if (data && data.access_token) {
                        this.defaultClient.authentications['auth'].accessToken = data.access_token;
                        resolve(data.access_token);
                    } else {
                        reject('Error: failed to retrieve token!')
                    }
                }
            });
        });
    }

    sendSMS(to: string, body: string) {
        return this.getAuth().then(token => {
            let apiInstance = new TelstraMessaging.MessagingApi();
            let payload = new TelstraMessaging.SendSMSRequest(to, body);

            return new Promise((resolve, reject) => {
                apiInstance.sendSMS(payload, (error, data, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
        });
    }

}

