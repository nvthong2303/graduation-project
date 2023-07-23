import React, { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import {useSelector} from "react-redux";
import {Player} from "@lottiefiles/react-lottie-player";
import waitingJson from "../../assets/animation/waiting.json";
import {Button, Typography} from "@mui/material";
import Video from "./videoReceive";
import io from "socket.io-client";
import {MEDIA_SERVER_URL} from "../../utils/config";
import VideoCall_SFU from "./VideoCall_SFU";

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
    const socketRef = useRef<SocketIOClient.Socket>();
    const [streaming, setStreaming] = React.useState(true);
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom);

    const startStreaming = async () => {
        setStreaming(true);
    }

    const endStreaming = () => {
        setStreaming(false);
    };

    React.useEffect(() => {
    //     setJoin(false)
    //     setUsers([])
    //     // @ts-ignore
    //     localVideoRef.current = undefined;
    //     localStreamRef.current = undefined;
    //     getLocalStream();
        setStreaming(false);

        setTimeout(() => {
            setStreaming(true)
        }, 300)
    }, [currentRoom._id])

    return (
        <>
            {currentRoom.admin && infoUser.email && streaming ? (
                <>
                    <VideoCall_SFU room={currentRoom} user={infoUser}/>
                </>
                ) : (
                    <>
                        <Button onClick={startStreaming}>Join call</Button>
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
                    </>
                )
            }
        </>
    )
}
