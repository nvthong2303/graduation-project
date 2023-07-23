/* eslint-disable jsx-a11y/alt-text */
import {
    Box,
    ListItem,
    Tooltip,
    IconButton ,
    Avatar,
} from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {makeStyles} from "@mui/styles";
import { socketRef} from "../../socket/socket-io";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        borderRadius: 10
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 150,
        height: 150,
        borderRadius: 10
    },
    cardAction: {
        display: 'block',
        textAlign: 'initial'
    },
    thumbnailMiniTitle: {
        width: 50,
        height: 50,
        marginLeft: '5px'
    }
});
interface PropsType {
    id: string;
    src?: string;
    position?: 'left' | 'right';
    message?: string;
    timestamp?: string
    sender: string
    roomId: string
}

export default function MessageItem(props: PropsType) {
    const classes = useStyles();
    let detailMessage = <p style={{ margin: '4px 16px' }}>{props.message}</p>;
    const [show, setShow] = React.useState(false)

    const senderMessageStyle: any = {
        item: {
            padding: '8px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
        },
        box: {
            // marginRight: 'auto',
            backgroundColor: '#e0e0e0',
            borderRadius: '16px',
            fontSize: 15,
            whiteSpace: 'pre-line',
            width: 'fit-content',
            padding: '5px'
        }
    };

    const myMessageStyle: any = {
        item: {
            padding: '8px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            float: 'right'
        },
        box: {
            marginLeft: 'auto',
            backgroundColor: '#0084ff',
            color: 'white',
            borderRadius: '16px',
            fontSize: 15,
            whiteSpace: 'pre-line',
            width: 'fit-content',
            padding: '5px'
        }
    };


    function renderAvatar() {
        let avatarUrl = 'https://s120.avatar.talk.zdn.vn/default';

        return (
            <Tooltip title={props.sender} sx={{ marginRight: '8px' }}>
                <Avatar>{props.sender[0]}</Avatar>
            </Tooltip>
        )
    }

    const handleDeleteMessage = () => {
        socketRef.current?.emit("delete", {
            room: props.roomId,
            messageId: props.id
        })
    }

    return (
        <Box>
            <ListItem
                style={
                    props.position === 'right'
                        ? myMessageStyle.item
                        : senderMessageStyle.item
                }
            >
                {props.position === 'left' ? renderAvatar() : null}
                <Box
                    style={{width: props.position !== 'left' ? 'auto' : '60%', display: 'flex'}}
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                >
                    {props.position !== 'left' && show ? (
                        <IconButton onClick={handleDeleteMessage} aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                    ) : null }
                    <Box
                        sx={
                            props.position === 'right'
                                ? myMessageStyle.box
                                : senderMessageStyle.box
                        }
                    >
                        <Tooltip placement={props.position} title={props.timestamp}>
                            {detailMessage}
                        </Tooltip>
                    </Box>
                    {/*{props.position === 'left' && show ? (*/}
                    {/*    <IconButton aria-label="delete">*/}
                    {/*        <DeleteIcon/>*/}
                    {/*    </IconButton>*/}
                    {/*) : null }*/}
                </Box>
            </ListItem>
        </Box>
    );
}
