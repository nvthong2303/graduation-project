import React from 'react';
import {makeStyles} from "@mui/styles";
import {InputBase, IconButton} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {useDispatch, useSelector} from "react-redux";
import {sendMessageSuccess} from "../../store/action/message.action";
import {message} from "../../store/reducer/messge.reducer";
import {SendMessage} from "../../apis/message.api";
import { socketRef} from "../../socket/socket-io";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        maxHeight: '100%',
        maxWidth: '100%',
        padding: '4px 8px 6px 8px'
    },
    text_input: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        paddingLeft: '8px !important'
    }
})

export default function SendBox(props: any) {
    const { room } = props
    const [contentMessage, setContentMessage] = React.useState('');
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const classes = useStyles();
    const dispatch = useDispatch();

    function handleKeyDown(event: any) {
        if (event.shiftKey && event.keyCode === 13) {
        } else if (event.keyCode === 13) {
            event.preventDefault();
            handleSendMessage()
        }
    }

    const handleSendMessage = async () => {
        const newMessage = {
            content: contentMessage,
            sender: infoUser.email,
            senderName: infoUser.fullName,
            room: room._id,
            createdAt: new Date().toISOString(),
        }
        socketRef.current?.emit("message", newMessage)
        setContentMessage('')
    }

    return (
        <div className={classes.root}>
            <InputBase
                maxRows={2}
                onKeyDown={handleKeyDown}
                multiline
                id="textInput"
                name="textInput"
                className={classes.text_input}
                placeholder='Aa..'
                onChange={(event: any) => setContentMessage(event.target.value)}
                value={contentMessage}
            />
            <IconButton onClick={handleSendMessage}>
                <SendIcon />
            </IconButton>
        </div>
    )
}
