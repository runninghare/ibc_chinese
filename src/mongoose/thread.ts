import {IbcDB} from './base';

export interface IntMessage {
  sender?: string;
  timestamp?: string;
  body: string;
}

export interface IntThread {
  id: string;
  type: 'private'|'public'|'group';
  participants: any;
  messages: IntMessage[];
}

var ThreadSchema = IbcDB.mongoose.Schema({
  id: String,
  type: String,
  participants: {},
  messages: [{sender: String, timestamp: String, body: String}]
});

export class Thread extends IbcDB {

    public static model = IbcDB.mongoose.model('Thread', ThreadSchema);

    constructor(data: any) {
        super();
        return Thread.model(data);
    }
    
}