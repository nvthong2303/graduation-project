const express = require('express');
const app = express();
const http = require('http');
let wrtc = require("wrtc");
const server = http.createServer(app);
const io = require('socket.io')(server);
const config = require('./config/config');

const mongoose = require('mongoose');
const { handleSaveMessage } = require("./handles/messages/message.repository");

let receiverPCs = {};
let senderPCs = {};
let users = {};
let socketToRoom = {};

mongoose.connect(config.mongo.uri)
    .then(
        () => {
            console.log('Socket server connect mongoDB successfully')
        },
        (err) => {
            console.log('mongoDB error', err)
        }
    )
    .catch((err) => {
        console.log('ERR :', err)
    });

io.on('connection', (socket) => {
    socket.on("join", (roomId) => {
        try {
            // console.log(`Client ${roomId} đã tham gia roomId "${roomId}".`);
            socket.join(roomId);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("message", (message) => {
        io.to(message.room).emit('receiveMessage', message);
        // console.log(`Đã gửi tin nhắn đến channel "${message.room}": ${message.content}`);

        handleSaveMessage(message);
    });

    socket.on("disconnect", () => {
        try {
            for (const channel in socket.rooms) {
                if (channel !== socket.id) {
                    socket.leave(channel);
                    console.log(`Client ${socket.id} đã rời khỏi channel "${channel}".`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
});

app.get('/', (req, res) => {
    res.json({
        receiverPCs,
        senderPCs,
        users,
        socketToRoom,
    });
});

server.listen(config.port, () => {
    console.log(`listening on *:${config.port}`);
});