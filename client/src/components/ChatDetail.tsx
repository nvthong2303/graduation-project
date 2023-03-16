import React from 'react';
import {makeStyles} from "@mui/styles";
import {Typography, IconButton} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HeaderChat from "./Chat/Header";
import SendBox from "./Chat/SendBox";

const useStyles = makeStyles({
    root: {
        width: '100%',
        minHeight: '100%',
        background: 'linear-gradient(45deg, #9cd8fb 30%, #ffffff 90%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    header: {
        height: '32px',
        width: '100%',
        display: 'flex',
        boxShadow: '0px 15px 10px -15px #111',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '16px',
        paddingRight: '16px'
    },
    listMessage: {
    },
    inputMessage: {
        height: '40px',
        boxShadow: '0px -15px 10px -15px #111'
    }
})

export default function ChatDetail(props: any) {
    const { room } = props;
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <HeaderChat room={room} />
            </div>
            <div className={classes.listMessage}>

            </div>
            <div className={classes.inputMessage}>
                <SendBox />
            </div>
        </div>
    )
}