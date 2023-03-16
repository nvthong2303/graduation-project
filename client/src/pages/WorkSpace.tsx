import React from 'react';
import {useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";

import { makeStyles } from "@mui/styles";
import {Grid, Typography} from '@mui/material';
import {Player} from "@lottiefiles/react-lottie-player";

import Header from "../components/Header";
import ListConversation from "../components/ListConversation";
import ChatDetail from "../components/ChatDetail";
import {PATHS} from "../constants/paths";
import * as lottieJson from "../assets/animation/meeting.json";

const useStyles = makeStyles({
    root: {
        backgroundColor: '#032056',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    workSpace: {
        height: 'calc(100vh - 24px)',
        marginTop: 0,
        overflow: 'hidden'
    },
    listConversation: {
        padding: 0,
        marginTop: 0,
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

export default function WorkSpace() {
    const classes = useStyles();
    const match = useRouteMatch();

    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)

    React.useEffect(() => {
        if (match.path === PATHS.WORK) {
            console.log('asdasdasd')
        }
    }, [])

    return (
        <div className={classes.root}>
            <Header />
            <Grid className={classes.workSpace} container spacing={2}>
                <Grid className={classes.listConversation} item xs={0.6}>
                    <ListConversation />
                </Grid>
                {match.path === PATHS.WORK ? (
                        <Grid className={classes.home} item xs={11.4}>
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
                        </Grid>
                    ) : (
                    <>
                        <Grid className={classes.conversation} item xs={3.4}>
                            <ChatDetail room={currentRoom} />
                        </Grid>
                        <Grid className={classes.streaming} item xs={8}>
                            c
                        </Grid>
                    </>
                )}
            </Grid>
        </div>
    )
}