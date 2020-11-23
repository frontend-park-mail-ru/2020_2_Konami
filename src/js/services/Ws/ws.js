'use strict';

import EventBus from "@/js/services/EventBus/EventBus.js";

export class Ws {
    constructor() {

        const address = ['https', 'https:'].includes(location.protocol)
            ? `wss://${location.hostname}:3000/ws`
            : `ws://${location.hostname}:3000/ws`;


        this.ws = new WebSocket(address);
        this.ws.onopen = (event) => {
            console.log(`WebSocket on address ${address} opened`);
            console.dir(this.ws);

            this.ws.onmessage = this.handleMessage.bind(this);

            this.ws.onclose = () => {
                console.log(`WebSocket closed`);
            };
        };
    }

    handleMessage(event) {
        const messageText = event.data;

        try {
            const message = JSON.parse(messageText);
            console.log(message);
            EventBus.dispatchEvent(message.type, message.payload);
        } catch (err) {
            console.error('smth went wront in handleMessage: ', err);
        }
    }

    send(type, payload) {
        this.ws.send(JSON.stringify({type, payload}));
    }
}
