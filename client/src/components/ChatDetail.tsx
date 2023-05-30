import React from 'react';
import {makeStyles} from "@mui/styles";
import {Typography, IconButton} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HeaderChat from "./Chat/Header";
import SendBox from "./Chat/SendBox";
import ListMessage from "./Chat/ListMessage";

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: 'calc(100vh - 40px)',
        background: 'linear-gradient(45deg, #9cd8fb 30%, #ffffff 90%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '2px solid black'
    },
    header: {
        height: '32px !important',
        width: '100%',
        display: 'flex',
        boxShadow: '0px 15px 10px -15px #111',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '16px',
        paddingRight: '16px'
    },
    listMessage: {
        height: 'calc(100% - 80px) !important'
    },
    inputMessage: {
        height: '40px',
        boxShadow: '0px -15px 10px -15px #111'
    }
})

export default function ChatDetail(props: any) {
    const { room } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <HeaderChat room={room} />
            </div>
            <div className={classes.listMessage}>
                <ListMessage room={room} />
            </div>
            <div className={classes.inputMessage}>
                <SendBox room={room} />
            </div>
        </div>
    )
}