import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom';

import { makeStyles } from "@mui/styles";
import { Avatar, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import { room } from "../store/reducer/room.reducer";
import { selectRoom } from "../store/action/room.action";
import { PATHS } from "../constants/paths";
import {getSrcAvatarRoom} from "../common";
import {clearListMessage} from "../store/action/message.action";

export interface avatarMap {
    [key: string]: any;
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '80% !important',
        overflowY: 'hidden',
        background: 'linear-gradient(45deg, #032056 30%, #4e42ff 90%);',
        '&:hover': {
            overflowY: 'auto'
        },
        '&:hover&::-webkit-scrollbar': {
            width: 5
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: 5
        },
    },
    hoverPointer: {
        '&:hover': {
            cursor: 'pointer'
        },
    }
})
export default function ListConversation() {
    const classes = useStyles()
    const listRoom: room[] = useSelector((state: any) => state.roomReducer?.listRoom);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSelectRoom = (room: room) => {
        dispatch(selectRoom(room))
        dispatch(clearListMessage())
        history.push(`${PATHS.CHAT}/${room._id}`);
    }

    return (
        <div style={{
            minHeight: '100%',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            <div
                className={classes.root}
                style={{
                    maxHeight: '80% !important'
                }}
            >
                {listRoom
                    .sort(function (a: room, b: room) {
                        return (b.timestamp - a.timestamp)
                    })
                    .map((room: any, index) => {
                        return (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Tooltip title={room.title} placement="right-start">
                                    <Avatar
                                        variant="square"
                                        sx={{
                                            margin: '8px',
                                            border: '1px solid #000000',
                                            boxShadow: 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px'
                                        }}
                                        className={classes.hoverPointer}
                                        onClick={() => {
                                            handleSelectRoom(room)
                                        }}
                                        src={getSrcAvatarRoom(room.avatar)}
                                    />
                                </Tooltip>
                            </div>
                        )
                    })}
            </div>
            <div style={{
                width: '60px',
                minHeight: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <SettingsIcon sx={{
                    width: '32px',
                    height: '32px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    )
}
