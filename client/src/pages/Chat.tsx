// import React from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import {useParams, useRouteMatch} from "react-router-dom";
//
// import { makeStyles } from "@mui/styles";
// import {Grid, Typography} from '@mui/material';
// import {Player} from "@lottiefiles/react-lottie-player";
//
// import Header from "../components/Header";
// import ListConversation from "../components/ListConversation";
// import ChatDetail from "../components/ChatDetail";
// import {PATHS} from "../constants/paths";
// import * as lottieJson from "../assets/animation/meeting.json";
// import * as waitingJson from "../assets/animation/waiting.json";
// import {GetDetailChatByEmail, GetDetailRoomById} from "../apis/room.api";
// import {getDetailRoomSuccess} from "../store/action/room.action";
// import SocketIO from "../socket/socket-io";
// import { useSnackbar } from 'notistack';
// import VideoCall from "../components/VideoCall/videoCall";
//
// const useStyles = makeStyles({
//     root: {
//         backgroundColor: '#032056',
//         width: '100% !important',
//         height: '100% !important',
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column'
//     },
//     workSpace: {
//         height: 'calc(100% - 40px)',
//         marginTop: 0,
//         overflow: 'hidden'
//     },
//     listConversation: {
//         padding: '0px !important',
//         marginTop: '0px !important',
//         maxHeight: '100%'
//     },
//     conversation: {
//         padding: 0,
//         marginTop: 0,
//         paddingLeft: '0 !important'
//     },
//     streaming: {
//         background: 'green',
//         padding: 0,
//         marginTop: 0
//     },
//     home: {
//         width: '100%',
//         height: '100%',
//         flexDirection: 'column',
//         alignItems: 'center',
//         background: 'linear-gradient(45deg, #9cd8fb 30%, #ffffff 90%)',
//     }
// });
//
// export default function Chat() {
//     const classes = useStyles();
//     const match = useRouteMatch();
//     const dispatch = useDispatch();
//     // @ts-ignore
//     const { id, email } = useParams();
//     const { enqueueSnackbar } = useSnackbar();
//
//     const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
//
//     React.useEffect(() => {
//         if (match.path === PATHS.CHAT) {
//             dispatch(getDetailRoomSuccess({}))
//         } else {
//             if (match.path === PATHS.CHAT_DETAIL) {
//                 handleGetDetailRoom(id)
//             } else {
//                 handleGetDetailRoom(id)
//             }
//         }
//     }, [JSON.stringify(currentRoom)])
//
//     const handleGetDetailRoom = async (id: string) => {
//         const token = localStorage.getItem("_token_")
//         if (token) {
//             if (id) {
//                 const res = await GetDetailRoomById(id, token)
//
//                 if (res.status === 200) {
//                     if (res.data) {
//                         dispatch(getDetailRoomSuccess(res.data))
//                     }
//                 } else {
//                     enqueueSnackbar('Not found class', {
//                         variant: 'error'
//                     });
//                 }
//             } else {
//                 const res = await GetDetailChatByEmail(email, token)
//                 if (res.status === 200) {
//                     if (res.data.data) {
//                         dispatch(getDetailRoomSuccess(res.data.data))
//                     }
//                 } else {
//                     enqueueSnackbar('Not found class', {
//                         variant: 'error'
//                     });
//                 }
//             }
//         }
//     }
//
//     return (
//         <div className={classes.root} style={{ overflow: 'hidden' }}>
//             <Header />
//             <Grid
//                 className={classes.workSpace}
//                 container
//                 spacing={2}
//                 sx={{
//                     marginTop: 0,
//                     marginLeft: 0,
//                     width: '100% !important',
//                     height: '100% !important',
//                 }}
//             >
//                 <Grid
//                     className={classes.listConversation}
//                     item
//                     xs={0.5}
//                     sx={{
//                         height: 'calc(100vh - 40px) !important'
//                     }}
//                 >
//                     <ListConversation />
//                 </Grid>
//                 <Grid
//                     className={classes.home}
//                     item
//                     xs={11.5}
//                     sx={{
//                         padding: '0px !important'
//                     }}
//                 >
//                     {Object.keys(currentRoom).length > 0 ? (
//                         <Grid
//                             container
//                             spacing={1}
//                             sx={{ width: '100%', height: '100%', margin: '0px', padding: '0px' }}
//                         >
//                             <Grid item xs={3.5} sx={{ padding: '0px !important' }}>
//                                 <ChatDetail room={currentRoom} />
//                             </Grid>
//                             <Grid item xs={8.5}>
//                                 <VideoCall />
//                             </Grid>
//                         </Grid>
//                     ) : (
//                         <div style={{ height: '100vh' }}>
//                             <Player
//                                 controls={false}
//                                 autoplay
//                                 loop
//                                 src={lottieJson}
//                                 style={{ width: '40%' }}
//                             ></Player>
//                             <Typography variant='subtitle1' style={{
//                                 width: '100%',
//                                 textAlign: 'center',
//                                 fontSize: 20,
//                                 fontWeight: 700
//                             }}>
//                                 Pick a conversation and start exploring.
//                             </Typography>
//                         </div>
//                     )}
//                 </Grid>
//             </Grid>
//             <SocketIO />
//         </div>
//     )
// }

import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import Video from "../components/VideoCall/videoReceive";

type WebRTCUser = {
    id: string;
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
const SOCKET_SERVER_URL = "http://localhost:8080";

const App = () => {
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
                console.log("create receiver offer success");
                await pc.setLocalDescription(new RTCSessionDescription(sdp));

                if (!socketRef.current) return;
                socketRef.current.emit("receiverOffer", {
                    sdp,
                    receiverSocketID: socketRef.current.id,
                    senderSocketID,
                    roomID: "2303",
                });
            } catch (error) {
                console.log("err createReceiverOffer", error);
            }
        },
        []
    );

    useEffect(() => {
        console.log("======>", users)
    }, [users.length])

    const createReceiverPeerConnection = useCallback((socketID: string) => {
        try {
            const pc = new RTCPeerConnection(pc_config);
            console.log("pc2 ====>", pc)

            // add pc to peerConnections object
            receivePCsRef.current = { ...receivePCsRef.current, [socketID]: pc };

            pc.onicecandidate = (e) => {
                if (!(e.candidate && socketRef.current)) return;
                // console.log("receiver PC onicecandidate");
                socketRef.current.emit("receiverCandidate", {
                    candidate: e.candidate,
                    receiverSocketID: socketRef.current.id,
                    senderSocketID: socketID,
                });
            };

            pc.oniceconnectionstatechange = (e) => {
                console.log(e);
            };

            pc.ontrack = (e) => {
                // console.log("ontrack success");
                setUsers((oldUsers) =>
                    oldUsers
                        .filter((user) => user.id !== socketID)
                        .concat({
                            id: socketID,
                            stream: e.streams[0],
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
        (id: string) => {
            try {
                console.log(`socketID(${id}) user entered`);
                const pc = createReceiverPeerConnection(id);
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
            socketRef.current.emit("senderOffer", {
                sdp,
                senderSocketID: socketRef.current.id,
                roomID: "2303",
            });
        } catch (error) {
            console.log("err createSenderOffer", error);
        }
    }, []);

    const createSenderPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(pc_config);

        pc.onicecandidate = (e) => {
            if (!(e.candidate && socketRef.current)) return;
            console.log("sender PC onicecandidate");
            socketRef.current.emit("senderCandidate", {
                candidate: e.candidate,
                senderSocketID: socketRef.current.id,
            });
        };

        pc.oniceconnectionstatechange = (e) => {
            console.log(e);
        };

        if (localStreamRef.current) {
            console.log("add local stream");
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
                roomID: "2303",
            });
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, [createSenderOffer, createSenderPeerConnection]);

    useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER_URL);
        getLocalStream();

        socketRef.current.on("userEnter", (data: { id: string }) => {
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
                    console.log(`getReceiverCandidate socketID(${data.id})'s candidate`);
                    const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                    if (!(pc && data.candidate)) return;
                    await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                    console.log(`socketID(${data.id})'s candidate add success`);
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

    return (
        <div>
            <video
                style={{
                    width: 240,
                    height: 240,
                    margin: 5,
                    backgroundColor: "black",
                }}
                muted
                ref={localVideoRef}
                autoPlay
            />
            {users.map((user, index) => (
                <Video key={index} stream={user.stream} />
            ))}
        </div>
    );
};

export default App;
