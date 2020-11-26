const express = require('express');
const ws = require('express-ws');

const app = express();
ws(app);

const clients =  new Array(100);

app.ws('/ws', (ws, req) => {

    const id = Math.random();
    clients[id] = ws;
    console.log('новое соединение ' + id);

    ws.on('message', (message) => {
        console.log('получено сообщение ' + message);
        const parsedMsg = JSON.parse(message);
        const {type, payload} = parsedMsg;
        Object
            .values(clients)
            .forEach((client) => {
                client.send(JSON.stringify({
                    type,
                    payload,
                }))
            });
    });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`WS Server listening port ${port}`);
});
