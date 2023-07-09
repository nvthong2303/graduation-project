let socketio = require('socket.io');
let express = require('express');
let http = require('http');
let wrtc = require("wrtc");
let cors = require('cors');

let app = express();
let server = http.createServer(app);

let io = socketio.listen(server);

app.use(cors());
const PORT = process.env.PORT || 8080;

let users = {};
let receiverPCs = {};
let senderPCs = {};
let socketToRoom = {};

const pc_config = {
    iceServers: [
        // {
        //   urls: 'stun:[STUN_IP]:[PORT]',
        //   'credentials': '[YOR CREDENTIALS]',
        //   'username': '[USERNAME]'
        // },
        {
            urls: "stun:stun1.l.google.com:19302",
        },
    ],
};

const maximum = process.env.MAXIMUM || 4;

// function handle for SF4 architecture
const isIncluded = (array, id) => array.some((item) => item.id === id);

const createReceiverPeerConnection = (socketID, socket, roomID) => {
    const pc = new wrtc.RTCPeerConnection(pc_config);

    if (receiverPCs[socketID]) receiverPCs[socketID] = pc;
    else receiverPCs = { ...receiverPCs, [socketID]: pc };

    pc.onicecandidate = (e) => {
        //console.log(`socketID: ${socketID}'s receiverPeerConnection icecandidate`);
        socket.to(socketID).emit("getSenderCandidate_SF4", {
            candidate: e.candidate,
        });
    };

    pc.oniceconnectionstatechange = (e) => {
        //console.log(e);
    };

    pc.ontrack = (e) => {
        if (users[roomID]) {
            if (!isIncluded(users[roomID], socketID)) {
                users[roomID].push({
                    id: socketID,
                    stream: e.streams[0],
                });
            } else return;
        } else if (socketID && roomID) {
            users[roomID] = [
                {
                    id: socketID,
                    stream: e.streams[0],
                },
            ];
        }
        socket.broadcast.to(roomID).emit("userEnter_SF4", { id: socketID });
    };

    return pc;
};

const createSenderPeerConnection = (
    receiverSocketID,
    senderSocketID,
    socket,
    roomID
) => {
    const pc = new wrtc.RTCPeerConnection(pc_config);

    if (senderPCs[senderSocketID]) {
        senderPCs[senderSocketID].filter((user) => user.id !== receiverSocketID);
        senderPCs[senderSocketID].push({ id: receiverSocketID, pc });
    } else
        senderPCs = {
            ...senderPCs,
            [senderSocketID]: [{ id: receiverSocketID, pc }],
        };

    pc.onicecandidate = (e) => {
        //console.log(`socketID: ${receiverSocketID}'s senderPeerConnection icecandidate`);
        socket.to(receiverSocketID).emit("getReceiverCandidate_SF4", {
            id: senderSocketID,
            candidate: e.candidate,
        });
    };

    pc.oniceconnectionstatechange = (e) => {
        //console.log(e);
    };

    const sendUser = users[roomID].filter(
        (user) => user.id === senderSocketID
    )[0];
    sendUser.stream.getTracks().forEach((track) => {
        pc.addTrack(track, sendUser.stream);
    });

    return pc;
};

const getOtherUsersInRoom = (socketID, roomID) => {
    let allUsers = [];

    if (!users[roomID]) return allUsers;

    allUsers = users[roomID]
        .filter((user) => user.id !== socketID)
        .map((otherUser) => ({ id: otherUser.id }));

    return allUsers;
};

const deleteUser = (socketID, roomID) => {
    if (!users[roomID]) return;
    users[roomID] = users[roomID].filter((user) => user.id !== socketID);
    if (users[roomID].length === 0) {
        delete users[roomID];
    }
    delete socketToRoom[socketID];
};

const closeReceiverPC = (socketID) => {
    if (!receiverPCs[socketID]) return;

    receiverPCs[socketID].close();
    delete receiverPCs[socketID];
};

const closeSenderPCs = (socketID) => {
    if (!senderPCs[socketID]) return;

    senderPCs[socketID].forEach((senderPC) => {
        senderPC.pc.close();
        const eachSenderPC = senderPCs[senderPC.id].filter(
            (sPC) => sPC.id === socketID
        )[0];
        if (!eachSenderPC) return;
        eachSenderPC.pc.close();
        senderPCs[senderPC.id] = senderPCs[senderPC.id].filter(
            (sPC) => sPC.id !== socketID
        );
    });

    delete senderPCs[socketID];
};
// -------------------------------------------

io.on('connection', socket => {
    // event 2P2 architecture
    socket.on('join_room_2P2', data => {
        if (users[data.room]) {
            const length = users[data.room].length;
            if (length === maximum) {
                socket.to(socket.id).emit('room_full');
                return;
            }
            users[data.room].push({id: socket.id, email: data.email});
        } else {
            users[data.room] = [{id: socket.id, email: data.email}];
        }
        socketToRoom[socket.id] = data.room;

        socket.join(data.room);
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

        const usersInThisRoom = users[data.room].filter(user => user.id !== socket.id);

        io.sockets.to(socket.id).emit('all_users_2P2', usersInThisRoom);
    });

    socket.on('offer_2P2', data => {
        socket.to(data.offerReceiveID).emit('getOffer_2P2', {sdp: data.sdp, offerSendID: data.offerSendID, offerSendEmail: data.offerSendEmail});
    });

    socket.on('answer_2P2', data => {
        socket.to(data.answerReceiveID).emit('getAnswer_2P2', {sdp: data.sdp, answerSendID: data.answerSendID});
    });

    socket.on('candidate_2P2', data => {
        socket.to(data.candidateReceiveID).emit('getCandidate_2P2', {candidate: data.candidate, candidateSendID: data.candidateSendID});
    })

    // event SF4 architecture
    socket.on("joinRoom_SF4", (data) => {
        try {
            let allUsers = getOtherUsersInRoom(data.id, data.roomID);
            io.to(data.id).emit("allUsers_SF4", { users: allUsers });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("senderOffer_SF4", async (data) => {
        try {
            socketToRoom[data.senderSocketID] = data.roomID;
            let pc = createReceiverPeerConnection(
                data.senderSocketID,
                socket,
                data.roomID
            );
            await pc.setRemoteDescription(data.sdp);
            let sdp = await pc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(sdp);
            socket.join(data.roomID);
            io.to(data.senderSocketID).emit("getSenderAnswer_SF4", { sdp });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("senderCandidate_SF4", async (data) => {
        try {
            // console.log("senderCandidate_SF4 ", data)
            let pc = receiverPCs[data.senderSocketID];
            await pc.addIceCandidate(new wrtc.RTCIceCandidate(data.candidate));
        } catch (error) {
            // console.log(error);
        }
    });

    socket.on("receiverOffer_SF4", async (data) => {
        try {
            let pc = createSenderPeerConnection(
                data.receiverSocketID,
                data.senderSocketID,
                socket,
                data.roomID
            );
            await pc.setRemoteDescription(data.sdp);
            let sdp = await pc.createAnswer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
            });
            await pc.setLocalDescription(sdp);
            io.to(data.receiverSocketID).emit("getReceiverAnswer_SF4", {
                id: data.senderSocketID,
                sdp,
            });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("receiverCandidate_SF4", async (data) => {
        try {
            const senderPC = senderPCs[data.senderSocketID].filter(
                (sPC) => sPC.id === data.receiverSocketID
            )[0];
            await senderPC.pc.addIceCandidate(
                new wrtc.RTCIceCandidate(data.candidate)
            );
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(user => user.id !== socket.id);
            users[roomID] = room;
            if (room.length === 0) {
                delete users[roomID];
                return;
            }
        }

        // delete user SF4 architecture
        deleteUser(socket.id, roomID);
        closeReceiverPC(socket.id);
        closeSenderPCs(socket.id);

        socket.broadcast.to(roomID).emit('user_exit', {id: socket.id});
    })
});

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
