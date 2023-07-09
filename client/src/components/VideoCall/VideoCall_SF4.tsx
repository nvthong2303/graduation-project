import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import Video from "./videoReceive";
import { WebRTCUser } from "../../common/interface";

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


const VideoCall_SF4 = () => {
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
                socketRef.current.emit("receiverOffer_SF4", {
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

    const createReceiverPeerConnection = useCallback((socketID: string) => {
        try {
            const pc = new RTCPeerConnection(pc_config);
            console.log("pc2 ====>", pc)

            // add pc to peerConnections object
            receivePCsRef.current = { ...receivePCsRef.current, [socketID]: pc };

            pc.onicecandidate = (e) => {
                if (!(e.candidate && socketRef.current)) return;
                // console.log("receiver PC onicecandidate");
                socketRef.current.emit("receiverCandidate_SF4", {
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
            console.log("all sender offer", {
                sdp,
                senderSocketID: socketRef.current.id,
                roomID: "2303",
            })
            socketRef.current.emit("senderOffer_SF4", {
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
            console.log("sender PC onicecandidate", {
                candidate: e.candidate,
                senderSocketID: socketRef.current.id,
            });
            socketRef.current.emit("senderCandidate_SF4", {
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

            socketRef.current.emit("joinRoom_SF4", {
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

        socketRef.current.on("userEnter_SF4", (data: { id: string }) => {
            createReceivePC(data.id);
        });

        socketRef.current.on(
            "allUsers_SF4",
            (data: { users: Array<{ id: string }> }) => {
                data.users.forEach((user) => createReceivePC(user.id));
            }
        );

        socketRef.current.on("user_exit", (data: { id: string }) => {
            closeReceivePC(data.id);
            setUsers((users) => users.filter((user) => user.id !== data.id));
        });

        socketRef.current.on(
            "getSenderAnswer_SF4",
            async (data: { sdp: RTCSessionDescription }) => {
                try {
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
            "getSenderCandidate_SF4",
            async (data: { candidate: RTCIceCandidateInit }) => {
                try {
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
            "getReceiverAnswer_SF4",
            async (data: { id: string; sdp: RTCSessionDescription }) => {
                try {
                    const pc: RTCPeerConnection = receivePCsRef.current[data.id];
                    if (!pc) return;
                    await pc.setRemoteDescription(data.sdp);
                } catch (error) {
                    console.log(error);
                }
            }
        );

        socketRef.current.on(
            "getReceiverCandidate_SF4",
            async (data: { id: string; candidate: RTCIceCandidateInit }) => {
                try {
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

export default VideoCall_SF4;
