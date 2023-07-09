import React, { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import {useSelector} from "react-redux";
import {Player} from "@lottiefiles/react-lottie-player";
import waitingJson from "../../assets/animation/waiting.json";
import {Button, Typography} from "@mui/material";
import Video from "./videoReceive";
import { socketRef } from '../../socket/socket-io';

const useStyles = makeStyles({
    root: {
    },
});

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

export type WebRTCUser = {
    id: string;
    stream: MediaStream;
};
export default function VideoCall(props: any) {
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const classes = useStyles();
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const [streaming, setStreaming] = React.useState(false);

    const localStreamRef = useRef<MediaStream>();
    const sendPCRef = useRef<RTCPeerConnection>();
    const receivePCsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [users, setUsers] = useState<Array<WebRTCUser>>([]);

    useEffect(() => {
    }, [users.length])

    const localVideoRef = useRef<HTMLVideoElement>(null);

    const closeReceivePC = useCallback((id: string) => {
        if (!receivePCsRef.current[id]) return;
        receivePCsRef.current[id].close();
        delete receivePCsRef.current[id];
    }, []);

    const createReceiverOffer = useCallback(
        async (pc: RTCPeerConnection, senderSocketId: string) => {
            try {
                const sdp = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                });
                console.log("create receiver offer success");
                await pc.setLocalDescription(new RTCSessionDescription(sdp));

                if (!socketRef.current) return;
                socketRef.current.emit("receiverOffer", {
                    sdp,
                    receiverSocketId: socketRef.current.id,
                    senderSocketId,
                    roomID: "1234",
                });
            } catch (error) {
                console.log(error);
            }
        },
        []
    );

    const createReceiverPeerConnection = useCallback((socketId: string) => {
        try {
            const pc = new RTCPeerConnection(pc_config);
            console.log("pc2 ====>", pc)

            // add pc to peerConnections object
            receivePCsRef.current = { ...receivePCsRef.current, [socketId]: pc };

            pc.onicecandidate = (e) => {
                if (!(e.candidate && socketRef.current)) return;
                // console.log("receiver PC onicecandidate");
                socketRef.current.emit("receiverCandidate", {
                    candidate: e.candidate,
                    receiverSocketID: socketRef.current.id,
                    senderSocketId: socketId,
                });
            };

            pc.oniceconnectionstatechange = (e) => {
                console.log(e);
            };

            pc.ontrack = (e) => {
                console.log("ontrack success");
                setUsers((oldUsers) =>
                    oldUsers
                        .filter((user) => user.id !== socketId)
                        .concat({
                            id: socketId,
                            stream: e.streams[0],
                        })
                );
            };

            // return pc
            return pc;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }, []);

    const createReceivePC = useCallback(
        (id: string) => {
            try {
                console.log(`socketID(${id}) user entered`);
                const pc = createReceiverPeerConnection(id);
                if (!(socketRef.current && pc)) return;
                createReceiverOffer(pc, id);
            } catch (error) {
                console.log(error);
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

            console.log('=====>', socketRef.current)
            if (!socketRef.current) return;
            socketRef.current.emit("senderOffer", {
                sdp,
                senderSocketId: socketRef.current.id,
                roomId: currentRoom._id,
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const createSenderPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(pc_config);

        pc.onicecandidate = (e) => {
            if (!(e.candidate && socketRef.current)) return;
            // console.log("sender PC onicecandidate");
            socketRef.current.emit("senderCandidate", {
                candidate: e.candidate,
                senderSocketId: socketRef.current.id,
            });
        };

        pc.oniceconnectionstatechange = (e) => {
            console.log(e);
        };

        if (localStreamRef.current) {
            // console.log("add local stream");
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
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            if (!socketRef.current) return;

            createSenderPeerConnection();
            await createSenderOffer();

            socketRef.current.emit("joinRoom", {
                id: socketRef.current.id,
                roomId: currentRoom._id,
            });
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, [createSenderOffer, createSenderPeerConnection]);

    React.useEffect(() => {
        if (socketRef.current?.id && currentRoom._id) {
            socketRef.current.emit("joinRoom", {
                id: socketRef.current.id,
                roomId: currentRoom._id,
            });

            socketRef.current.on("userEnter", (data: { id: string }) => {
                console.log("user enter")
                createReceivePC(data.id);
            });

            socketRef.current.on(
                "allUsers",
                (data: { users: Array<{ id: string }> }) => {
                    data.users.forEach((user) => createReceivePC(user.id));
                }
            );

            socketRef.current.on("userExit", (data: { id: string }) => {
                closeReceivePC(data.id);
                setUsers((users) => users.filter((user) => user.id !== data.id));
            });

            socketRef.current.on(
                "getSenderAnswer",
                async (data: { sdp: RTCSessionDescription }) => {
                    try {
                        if (!sendPCRef.current) return;
                        console.log("get sender answer");
                        console.log(data.sdp);
                        await sendPCRef.current.setRemoteDescription(
                            new RTCSessionDescription(data.sdp)
                        );
                    } catch (error) {
                        console.log(error);
                    }
                }
            );

            socketRef.current.on(
                "getSenderCandidate",
                async (data: { candidate: RTCIceCandidateInit }) => {
                    try {
                        if (!(data.candidate && sendPCRef.current)) return;
                        console.log("get sender candidate");
                        await sendPCRef.current.addIceCandidate(
                            new RTCIceCandidate(data.candidate)
                        );
                        console.log("candidate add success");
                    } catch (error) {
                        console.log(error);
                    }
                }
            );

            socketRef.current.on(
                "getReceiverAnswer",
                async (data: { id: string; sdp: RTCSessionDescription }) => {
                    try {
                        console.log(`getReceiverAnswer socketID(${data.id})'s answer`);
                        const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                        if (!pc) return;
                        await pc.setRemoteDescription(data.sdp);
                        console.log(`socketID(${data.id})'s set remote sdp success`);
                    } catch (error) {
                        console.log(error);
                    }
                }
            );

            socketRef.current.on(
                "getReceiverCandidate",
                async (data: { id: string; candidate: RTCIceCandidateInit }) => {
                    try {
                        console.log(data);
                        console.log(`get socketID(${data.id})'s candidate`);
                        const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                        if (!(pc && data.candidate)) return;
                        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                        console.log(`socketID(${data.id})'s candidate add success`);
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        }
    }, [currentRoom._id, socketRef?.current?.id]);

    const startStreaming = async () => {
        if (socketRef.current?.id) {
            setStreaming(true);
            await getLocalStream();
        }
    }

    const endStreaming = () => {
        setStreaming(false);
        localStreamRef.current = undefined;
        sendPCRef.current = undefined;
        if (socketRef.current) {
            socketRef.current.emit("outRoom", {});
        }
        if (sendPCRef.current) {
            // @ts-ignore
            sendPCRef.current?.close();
        }
        users.forEach((user) => closeReceivePC(user.id));
    };

    return (
        <>
            {streaming ? (
                <>
                    <div style={{
                        width: '100%',
                        height: '75%',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                            <video
                                style={{
                                    width: 'auto',
                                    height: "20%",
                                    margin: 5,
                                    backgroundColor: "black",
                                }}
                                muted
                                ref={localVideoRef}
                                autoPlay
                            />
                        <Button onClick={endStreaming}>End streaming</Button>
                    </div>
                </>
                ) : (
                    <>
                        <Button onClick={startStreaming}>Start streaming</Button>
                        <Player
                            controls={false}
                            autoplay
                            loop
                            src={waitingJson}
                            style={{ width: '50%' }}
                        ></Player>
                        <Typography variant='subtitle1' style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 700
                        }}>
                            Wait for the teacher to start the lesson ...
                        </Typography>
                        {/*{currentRoom.admin === infoUser.email ? (*/}
                        {/*    <Button onClick={startStreaming}>Start streaming</Button>*/}
                        {/*) : null }*/}
                    </>
                )
            }
            {users.map((user, index) => (
                <Video key={index} stream={user.stream}/>
            ))}
        </>
    )
}
