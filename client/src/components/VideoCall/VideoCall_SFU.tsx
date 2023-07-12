import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import Video from "./videoReceive";
import {MEDIA_SERVER_URL} from "../../utils/config";
import {useSelector} from "react-redux";
import {Button} from "@mui/material";

export type WebRTCUser = {
    id: string;
    name?: string;
    stream: MediaStream;
};

const pc_config = {
    iceServers: [
        // {
        //   urls: 'stun:[STUN_IP]:[PORT]',
        //   'credentials': '[YOR CREDENTIALS]',
        //   'username': '[USERNAME]'
        // },
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};


const VideoCall_SFU = () => {
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const socketRef = useRef<SocketIOClient.Socket>();
    const localStreamRef = useRef<MediaStream>();
    const sendPCRef = useRef<RTCPeerConnection>();
    const receivePCsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [users, setUsers] = useState<Array<WebRTCUser>>([]);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    const closeReceivePC = useCallback((id: string) => {
        if (!receivePCsRef.current[id]) return;
        receivePCsRef.current[id].close();
        delete receivePCsRef.current[id];
    }, []);

    const createReceiverOffer = useCallback(
        async (pc: RTCPeerConnection, senderSocketID: string) => {
            try {
                const sdp = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                });
                await pc.setLocalDescription(new RTCSessionDescription(sdp));

                if (!socketRef.current) return;
                console.log(Date.now(), "emit receiverOffer_SFU")
                socketRef.current.emit("receiverOffer_SFU", {
                    sdp,
                    receiverSocketID: socketRef.current.id,
                    senderSocketID,
                    roomID: currentRoom._id,
                });
            } catch (error) {
                console.log("err createReceiverOffer", error);
            }
        },
        []
    );

    const createReceiverPeerConnection = useCallback((socketID: string, name: string) => {
        try {
            const pc = new RTCPeerConnection(pc_config);

            // add pc to peerConnections object
            console.log(Date.now(), "=====> set receivePCsRef")
            receivePCsRef.current = { ...receivePCsRef.current, [socketID]: pc };

            pc.onicecandidate = (e) => {
                if (!(e.candidate && socketRef.current)) return;
                console.log(Date.now(), "emit receiver PC onicecandidate");
                socketRef.current.emit("receiverCandidate_SFU", {
                    candidate: e.candidate,
                    receiverSocketID: socketRef.current.id,
                    senderSocketID: socketID,
                });
            };

            pc.oniceconnectionstatechange = (e) => {
                // console.log(e);
            };

            pc.ontrack = (e) => {
                console.log(Date.now(), "====> set users");
                setUsers((oldUsers) =>
                    oldUsers
                        .filter((user) => user.id !== socketID)
                        .concat({
                            id: socketID,
                            stream: e.streams[0],
                            name
                        })
                );
            };

            // return pc
            return pc;
        } catch (e) {
            console.error("err createReceiverPeerConnection", e);
            return undefined;
        }
    }, []);

    const createReceivePC = useCallback(
        (id: string, name: string) => {
            try {
                // console.log(`socketID(${id}) user entered`);
                const pc = createReceiverPeerConnection(id, name);
                if (!(socketRef.current && pc)) return;
                createReceiverOffer(pc, id);
            } catch (error) {
                console.log("err createReceivePC", error);
            }
        },
        [createReceiverOffer, createReceiverPeerConnection]
    );

    const createSenderOffer = useCallback(async () => {
        try {
            if (!sendPCRef.current) return;
            const sdp = await sendPCRef.current.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
            });
            // console.log("create sender offer success");
            await sendPCRef.current.setLocalDescription(
                new RTCSessionDescription(sdp)
            );

            if (!socketRef.current) return;
            console.log(Date.now(), 'emit senderOffer_SFU')
            socketRef.current.emit("senderOffer_SFU", {
                sdp,
                senderSocketID: socketRef.current.id,
                roomID: currentRoom._id,
                name: infoUser.fullName
            });
        } catch (error) {
            console.log("err createSenderOffer", error);
        }
    }, []);

    const createSenderPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(pc_config);

        pc.onicecandidate = (e) => {
            if (!(e.candidate && socketRef.current)) return;
            console.log(Date.now(), 'emit senderCandidate_SFU')
            socketRef.current.emit("senderCandidate_SFU", {
                candidate: e.candidate,
                senderSocketID: socketRef.current.id,
            });
        };

        pc.oniceconnectionstatechange = (e) => {
            // console.log(e);
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                if (!localStreamRef.current) return;
                pc.addTrack(track, localStreamRef.current);
            });
        } else {
            console.log("no local stream");
        }

        sendPCRef.current = pc;
    }, []);

    const getLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 240,
                    height: 240,
                },
            });
            localStreamRef.current = stream;
            console.log(Date.now(), "=====> set localVideoRef")
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            if (!socketRef.current) return;

            createSenderPeerConnection();
            await createSenderOffer();
            console.log(Date.now(), 'emit joinRoom_SFU')
            socketRef.current.emit("joinRoom_SFU", {
                id: socketRef.current.id,
                roomID: currentRoom._id,
            });
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, [createSenderOffer, createSenderPeerConnection]);

    useEffect(() => {
        socketRef.current = io.connect(MEDIA_SERVER_URL);
        getLocalStream();

        socketRef.current.on("userEnter_SFU", (data: { id: string, name: string }) => {
            console.log(Date.now(), "********** receive userEnter_SFU")
            createReceivePC(data.id, data.name);
        });

        socketRef.current.on(
            "allUsers_SFU",
            (data: { users: Array<{ id: string, name: string }> }) => {
                console.log(Date.now(),'********** all users', data)
                data.users.forEach((user) => createReceivePC(user.id, user.name));
            }
        );

        socketRef.current.on("user_exit", (data: { id: string }) => {
            closeReceivePC(data.id);
            setUsers((users) => users.filter((user) => user.id !== data.id));
        });

        socketRef.current.on(
            "getSenderAnswer_SFU",
            async (data: { sdp: RTCSessionDescription }) => {
                try {
                    console.log(Date.now(),"********** getSenderAnswer_SFU")
                    if (!sendPCRef.current) return;
                    await sendPCRef.current.setRemoteDescription(
                        new RTCSessionDescription(data.sdp)
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        );

        socketRef.current.on(
            "getSenderCandidate_SFU",
            async (data: { candidate: RTCIceCandidateInit }) => {
                try {
                    console.log(Date.now(),"********** getSenderCandidate_SFU")
                    if (!(data.candidate && sendPCRef.current)) return;
                    await sendPCRef.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        );

        socketRef.current.on(
            "getReceiverAnswer_SFU",
            async (data: { id: string; sdp: RTCSessionDescription }) => {
                try {
                    console.log(Date.now(), "********** getReceiverAnswer_SFU")
                    const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                    if (!pc) return;
                    await pc.setRemoteDescription(data.sdp);
                } catch (error) {
                    console.log(error);
                }
            }
        );

        socketRef.current.on(
            "getReceiverCandidate_SFU",
            async (data: { id: string; candidate: RTCIceCandidateInit }) => {
                try {
                    console.log(Date.now(),"********** getReceiverCandidate_SFU")
                    const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                    if (!(pc && data.candidate)) return;
                    await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                } catch (error) {
                    console.log(error);
                }
            }
        );

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (sendPCRef.current) {
                sendPCRef.current.close();
            }
            users.forEach((user) => closeReceivePC(user.id));
        };
        // eslint-disable-next-line
    }, [
        closeReceivePC,
        createReceivePC,
        createSenderOffer,
        createSenderPeerConnection,
        getLocalStream,
    ]);

    const check = () => {
        console.log("users ", users)
        console.log("local video ref", localVideoRef)
        console.log("local stream ref", localStreamRef)
        console.log("send pc ref", sendPCRef)
    }

    return (
        <div id="hahahahahahahah">
            <video
                style={{
                    width: 240,
                    height: 240,
                    backgroundColor: "black",
                }}
                muted
                ref={localVideoRef}
                autoPlay
            />
            {users.map((user, index) => (
                <Video key={index} stream={user.stream} name={user.name} />
            ))}
            <Button onClick={check}>check</Button>
        </div>
    );
};

export default VideoCall_SFU;
