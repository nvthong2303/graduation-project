import React from 'react';
import {makeStyles} from "@mui/styles";
import {InputBase, IconButton} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

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

export default function SendBox() {
    const [contentMessage, setContentMessage] = React.useState('');
    const classes = useStyles();

    function handleKeyDown(event: any) {
        if (event.shiftKey && event.keyCode === 13) {
        } else if (event.keyCode === 13) {
            console.log('send message')
        }
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
            <IconButton>
                <SendIcon />
            </IconButton>
        </div>
    )
}