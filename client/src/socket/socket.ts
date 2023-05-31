const io = require("socket.io-client/dist/socket.io")

const urlSocket = 'http://localhost:3002'

let connected: Boolean = false;
let ws: any;
const connectSocket = () => {
    try {
        console.log('aaaa')
        const socket = io('http://localhost:3002');
        socket.on('connect', () => {
            console.log('connect')
        });
        socket.on('disconnect', () => {
            console.log('disconnect')
        });
    } catch (e) {
        console.log('err connect socket', e)
    }
}

export {
    connectSocket
}



