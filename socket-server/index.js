const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const config = require('./config/config');

const mongoose = require('mongoose');
const { handleSaveMessage, handleDeleteMessage } = require("./handles/messages/message.repository");

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
            socket.join(roomId);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("message", (message) => {
        // console.log(`Đã gửi tin nhắn đến channel "${message.room}": ${message.content}`);

        handleSaveMessage(message).then((message) => {
            io.to(message.room).emit('receiveMessage', message);
        });
    });

    socket.on("delete", (message) => {
        io.to(message.room).emit('receiveDeleteMessage', message.messageId);
        // console.log(`Đã gửi tin nhắn đến channel "${message.room}": ${message.content}`);

        handleDeleteMessage(message.messageId);
    });

    socket.on("out_room", (roomId) => {
        socket.leave(roomId);
    })

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
        message: 'welcome to socket server'
    });
});

app.get('/test', (req, res) => {
    res.json({
        message: 'welcome to socket server'
    })
})

server.listen(config.port, () => {
    console.log(`socket-server is running on ${config.port}`);
});
