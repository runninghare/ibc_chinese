import * as fs from 'fs';
import * as async from 'async';
import {Thread, IntMessage, IntThread} from '../mongoose/thread';

/* This script fixes all thread message senders which happen to be a number, instead of string.

   e.g.
   1 => '001'
   201 => '201'
   
 */

Thread.connect();

Thread.read<IntThread>({}).then(threads => {
    threads.forEach(t => {
        let update = false;
        t.messages.forEach(msg => {
            if (typeof msg.sender == 'number') {
                update = true;
            }
        });
        if (update) {
            Thread.update({id: t.id}, {messages: t.messages}).then(res => {
                console.log(`${t.id} has been updated`);
            })
        }
    })
})