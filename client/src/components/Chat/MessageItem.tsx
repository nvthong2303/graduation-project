/* eslint-disable jsx-a11y/alt-text */
import {
    Box,
    ListItem,
    Tooltip,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import React from 'react';
import {makeStyles} from "@mui/styles";

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
    src?: string;
    position?: 'left' | 'right';
    message?: string;
    timestamp?: string
}

export default function MessageItem(props: PropsType) {
    const classes = useStyles();
    let detailMessage = <p style={{ margin: '4px 16px' }}>{props.message}</p>;

    const senderMessageStyle: any = {
        item: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
        },
        box: {
            marginRight: 'auto',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            fontSize: 15,
            whiteSpace: 'pre-line',
            width: 'fit-content',
            padding: '5px'
        }
    };

    const myMessageStyle: any = {
        item: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            float: 'right'
        },
        box: {
            marginLeft: 'auto',
            backgroundColor: '#0084ff',
            color: 'white',
            borderRadius: '8px',
            fontSize: 15,
            whiteSpace: 'pre-line',
            width: 'fit-content',
            padding: '5px'
        }
    };


    function renderAvatar() {
        let avatarUrl = 'https://s120.avatar.talk.zdn.vn/default';

        // if (props.src === '1') {
        //     return (
        //         <ListItemAvatar>
        //             <Avatar src={avatarUrl} />
        //         </ListItemAvatar>
        //     );
        // } else {
        //     return <ListItemAvatar></ListItemAvatar>;
        // }
        return <Avatar>H</Avatar>
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
                <Box style={{ width: '60%' }}>
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
                </Box>
            </ListItem>
        </Box>
    )
}