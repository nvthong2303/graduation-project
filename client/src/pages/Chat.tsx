import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams, useRouteMatch} from "react-router-dom";

import { makeStyles } from "@mui/styles";
import {Grid, Typography} from '@mui/material';
import {Player} from "@lottiefiles/react-lottie-player";

import Header from "../components/Header";
import ListConversation from "../components/ListConversation";
import ChatDetail from "../components/ChatDetail";
import {PATHS} from "../constants/paths";
import * as lottieJson from "../assets/animation/meeting.json";
import * as waitingJson from "../assets/animation/waiting.json";
import {GetDetailRoomById} from "../apis/room.api";
import {getDetailRoomSuccess} from "../store/action/room.action";

const useStyles = makeStyles({
    root: {
        backgroundColor: '#032056',
        width: '100% !important',
        height: '100% !important',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    workSpace: {
        height: 'calc(100% - 40px)',
        marginTop: 0,
        overflow: 'hidden'
    },
    listConversation: {
        padding: '0px !important',
        marginTop: '0px !important',
        maxHeight: '100%'
    },
    conversation: {
        padding: 0,
        marginTop: 0,
        paddingLeft: '0 !important'
    },
    streaming: {
        background: 'green',
        padding: 0,
        marginTop: 0
    },
    home: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #9cd8fb 30%, #ffffff 90%)',
    }
});

export default function Chat() {
    const classes = useStyles();
    const match = useRouteMatch();
    const dispatch = useDispatch();
    // @ts-ignore
    const { id } = useParams();

    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)

    React.useEffect(() => {
        if (match.path === PATHS.CHAT) {
            dispatch(getDetailRoomSuccess({}))
        } else {
            handleGetDetailRoom(id)
        }
    }, [JSON.stringify(currentRoom)])

    const handleGetDetailRoom = async (id: string) => {
        const token = localStorage.getItem("_token_")
        if (token) {
            const res = await GetDetailRoomById(id, token)

            if (res.status === 200) {
                dispatch(getDetailRoomSuccess(res.data))
            }
        }
    }

    return (
        <div className={classes.root} style={{ overflow: 'hidden' }}>
            <Header />
            <Grid
                className={classes.workSpace}
                container
                spacing={2}
                sx={{
                    marginTop: 0,
                    marginLeft: 0,
                    width: '100% !important',
                    height: '100% !important',
                }}
            >
                <Grid
                    className={classes.listConversation}
                    item
                    xs={0.5}
                    sx={{
                        height: 'calc(100vh - 40px) !important'
                    }}
                >
                    <ListConversation />
                </Grid>
                <Grid
                    className={classes.home}
                    item
                    xs={11.5}
                    sx={{
                        padding: '0px !important'
                    }}
                >
                    {Object.keys(currentRoom).length > 0 ? (
                        <Grid
                            container
                            spacing={1}
                            sx={{ width: '100%', height: '100%', margin: '0px', padding: '0px' }}
                        >
                            <Grid item xs={3.5} sx={{ padding: '0px !important' }}>
                                <ChatDetail room={currentRoom} />
                            </Grid>
                            <Grid item xs={8.5}>
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
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <Player
                                controls={false}
                                autoplay
                                loop
                                src={lottieJson}
                                style={{ width: '40%' }}
                            ></Player>
                            <Typography variant='subtitle1' style={{
                                width: '100%',
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: 700
                            }}>
                                Pick a conversation and start exploring.
                            </Typography>
                        </>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}