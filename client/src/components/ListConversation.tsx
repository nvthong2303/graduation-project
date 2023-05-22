import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom';

import { makeStyles } from "@mui/styles";
import { Avatar, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import { room } from "../store/reducer/room.reducer";
import { selectRoom } from "../store/action/room.action";
import { PATHS } from "../constants/paths";

const useStyles = makeStyles({
    root: {
        width: '100%',
        maxHeight: '92%',
        minHeight: '92%',
        overflowY: 'hidden',
        paddingLeft: '6px',
        paddingTop: '4px',
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
        }
    },
    hoverPointer: {
        '&:hover': {
            cursor: 'pointer'
        },
    }
})
export default function ListConversation() {
    const listRoom: room[] = useSelector((state: any) => state.roomReducer.listRoom);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        console.log(listRoom)
    }, [listRoom.length])

    const classes = useStyles()

    const handleSelectRoom = (room: room) => {
        dispatch(selectRoom(room))
        console.log(room)
        history.push(`${PATHS.CHAT}/${room._id}`);
    }

    return (
        <>
            <div className={classes.root}>
                {listRoom
                    .sort(function (a: room, b: room) {
                        return (b.timestamp - a.timestamp)
                    })
                    .map((room: any) => {
                        return (
                            <Tooltip title={room.title} placement="right-start">
                                <Avatar
                                    sx={{
                                        marginTop: '4px',
                                        border: '1px solid #000000',
                                        boxShadow: 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px'
                                    }}
                                    className={classes.hoverPointer}
                                    onClick={() => {
                                        handleSelectRoom(room)
                                    }}
                                >{room.title[0]}</Avatar>
                            </Tooltip>
                        )
                    })}
            </div>
            <SettingsIcon sx={{
                width: '32px',
                height: '32px',
                marginTop: '10px',
                color: '#ffffff'
            }} />
        </>
    )
}