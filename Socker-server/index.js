import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import config from './config/config.js';

const app = express()
const server = http.createServer(app)

const io = new Server(server)

app.get('/', (req, res) => {
    res.send('<h1>Welcome to SocketServer !!!</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected')
})

server.listen(config.port, () => {
    console.log(`socket server is listening on *:$${config.port}`);
})