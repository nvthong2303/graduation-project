import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import Video from "./videoReceive";
import {MEDIA_SERVER_URL} from "../../utils/config";
import {useSelector} from "react-redux";
import {Button, Typography} from "@mui/material";
import {Player} from "@lottiefiles/react-lottie-player";
import waitingJson from "../../assets/animation/waiting.json";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    root: {
        height: '100% !important',
        width: '100% !important',
    },
    video: {
        height: '90% !important',
        maxHeight: '90% !important',
        width: '100% !important',
        padding: '20px',
        display: 'inline-block'
    },
    button: {

    }
});


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

interface Props {
    room: any,
    user: any
}

const VideoCall_SFU = (props: Props) => {
    const { room, user } = props;
    const classes = useStyles();
    const socketRef = useRef<SocketIOClient.Socket>();
    const localStreamRef = useRef<MediaStream>();
    const sendPCRef = useRef<RTCPeerConnection>();
    const receivePCsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [users, setUsers] = useState<Array<WebRTCUser>>([]);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [join, setJoin] = React.useState(false);

    const closeReceivePC = useCallback((id: string) => {
        if (!receivePCsRef.current[id]) return;
        receivePCsRef.current[id].close();
        delete receivePCsRef.current[id];
    }, []);

    const createReceiverOffer = useCallback(async (pc: RTCPeerConnection, senderSocketID: string) => {
            try {
                const sdp = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                });
                await pc.setLocalDescription(new RTCSessionDescription(sdp));

                if (!socketRef.current) return;
                // console.log(Date.now(), "emit receiverOffer_SFU")
                socketRef.current.emit("receiverOffer_SFU", {
                    sdp,
                    receiverSocketID: socketRef.current.id,
                    senderSocketID,
                    roomID: room._id,
                });
            } catch (error) {
                console.log("err createReceiverOffer", error);
            }
        }, []);

    const createReceiverPeerConnection = useCallback((socketID: string, name: string) => {
        try {
            const pc = new RTCPeerConnection(pc_config);

            // add pc to peerConnections object
            // console.log(Date.now(), "=====> set receivePCsRef")
            receivePCsRef.current = { ...receivePCsRef.current, [socketID]: pc };

            pc.onicecandidate = (e) => {
                if (!(e.candidate && socketRef.current)) return;
                // console.log(Date.now(), "emit receiver PC onicecandidate");
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
                // console.log(Date.now(), "====> set users");
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

    const createReceivePC = useCallback((id: string, name: string) => {
            try {
                // console.log(`socketID(${id}) user entered`);
                const pc = createReceiverPeerConnection(id, name);
                if (!(socketRef.current && pc)) return;
                createReceiverOffer(pc, id);
            } catch (error) {
                console.log("err createReceivePC", error);
            }
        }, [createReceiverOffer, createReceiverPeerConnection]);

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
            // console.log(Date.now(), 'emit senderOffer_SFU')
            socketRef.current.emit("senderOffer_SFU", {
                sdp,
                senderSocketID: socketRef.current.id,
                roomID: room._id,
                name: user.fullName
            });
        } catch (error) {
            console.log("err createSenderOffer", error);
        }
    }, []);

    const createSenderPeerConnection = useCallback(() => {
        try {
            const pc = new RTCPeerConnection(pc_config);

            pc.onicecandidate = (e) => {
                if (!(e.candidate && socketRef.current)) return;
                // console.log(Date.now(), 'emit senderCandidate_SFU')
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
        } catch (e) {
            console.log('err createSenderPeerConnection', e)
        }

    }, []);

    const getLocalStream = useCallback(async () => {
        try {
            createSenderPeerConnection();
            await createSenderOffer();
            if (!socketRef.current) return;
            // console.log(Date.now(), 'emit joinRoom_SFU')
            socketRef.current.emit("joinRoom_SFU", {
                id: socketRef.current.id,
                roomID: room._id,
            });
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, [createSenderOffer, createSenderPeerConnection]);

    const getLocalStream2 = useCallback(async () => {
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
            createSenderPeerConnection();
            await createSenderOffer();
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, [createSenderOffer, createSenderPeerConnection]);

    useEffect(() => {
        socketRef.current = io.connect(MEDIA_SERVER_URL);
        getLocalStream();

        socketRef.current.on("userEnter_SFU", (data: { id: string, name: string }) => {
            // console.log(Date.now(), "********** receive userEnter_SFU")
            createReceivePC(data.id, data.name);
        });

        socketRef.current.on("allUsers_SFU", (data: { users: Array<{ id: string, name: string }> }) => {
                data.users.forEach((user) => createReceivePC(user.id, user.name));
            });

        socketRef.current.on("user_exit", (data: { id: string }) => {
            closeReceivePC(data.id);
            setUsers((users) => users.filter((user) => user.id !== data.id));
        });

        socketRef.current.on("getSenderAnswer_SFU", async (data: { sdp: RTCSessionDescription }) => {
                try {
                    // console.log(Date.now(),"********** getSenderAnswer_SFU")
                    if (!sendPCRef.current) return;
                    await sendPCRef.current.setRemoteDescription(
                        new RTCSessionDescription(data.sdp)
                    );
                } catch (error) {
                    console.log(error);
                }
            });

        socketRef.current.on("getSenderCandidate_SFU", async (data: { candidate: RTCIceCandidateInit }) => {
                try {
                    // console.log(Date.now(),"********** getSenderCandidate_SFU")
                    if (!(data.candidate && sendPCRef.current)) return;
                    await sendPCRef.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                } catch (error) {
                    console.log(error);
                }
            });

        socketRef.current.on("getReceiverAnswer_SFU", async (data: { id: string; sdp: RTCSessionDescription }) => {
                try {
                    // console.log(Date.now(), "********** getReceiverAnswer_SFU")
                    const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                    if (!pc) return;
                    await pc.setRemoteDescription(data.sdp);
                } catch (error) {
                    console.log(error);
                }
            });

        socketRef.current.on("getReceiverCandidate_SFU", async (data: { id: string; candidate: RTCIceCandidateInit }) => {
                try {
                    // console.log(Date.now(),"********** getReceiverCandidate_SFU")
                    const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                    if (!(pc && data.candidate)) return;
                    await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                } catch (error) {
                    console.log(error);
                }
            });

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

    const startCall = async () => {
        getLocalStream2()
        setJoin(true);
    }

    const outCall = () => {
        socketRef.current?.emit('endStream_SFU', {
            senderSocketID: socketRef.current.id,
            roomID: room._id,
        })
        setJoin(false);
    };

    return (
        <div className={classes.root}>
            <div className={classes.video}>
                {join ? (
                    <video
                        style={{
                            width: users.length === 0
                                ? '100%'
                                : users.length < 4
                                    ? '45%'
                                    : users.length < 9
                                        ? '45%'
                                        : '300px' ,
                            height: users.length === 0
                                ? '100%'
                                : users.length < 4
                                    ? '49%'
                                    : users.length < 9
                                        ? '30%'
                                        : '250px',
                            backgroundColor: "black",
                        }}
                        muted
                        ref={localVideoRef}
                        autoPlay
                    />
                ) : users.length === 0 ? (
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'center'
                    }}>
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
                            Join the meeting and experience together ...
                        </Typography>
                    </div>
                ) : null}
                {users.map((user, index) => (
                    <Video
                        key={index}
                        stream={user.stream}
                        name={user.name}
                        style={{
                            width: join
                                ? users.length < 4
                                    ? '45%'
                                    : users.length < 9
                                        ? '30%'
                                        : '300px' :
                                users.length === 1
                                    ? '100%'
                                    : users.length < 5
                                        ? '45%'
                                        : users.length < 10
                                            ? '30%'
                                            : '300px',
                            height: join
                                ? users.length < 4
                                    ? '45%'
                                    : users.length < 9
                                        ? '30%'
                                        : '250px' :
                                users.length === 1
                                    ? '100%'
                                    : users.length < 5
                                        ? '45%'
                                        : users.length < 10
                                            ? '30%'
                                            : '250px',
                        }}
                    />
                ))}
            </div>
            <Button onClick={() => {
                if (! join) {
                    startCall()
                } else {
                    outCall()
                }
            }}>{join ? 'End Call' : 'Start Call'}{users.length === 0
                ? '100%'
                : users.length < 4
                    ? '50%'
                    : users.length < 9
                        ? '30%'
                        : '300px'}{}</Button>
        </div>
    );
};

export default VideoCall_SFU;
