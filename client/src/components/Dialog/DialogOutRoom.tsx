import React from 'react';
import {makeStyles} from '@mui/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { useSnackbar } from "notistack";
import {useHistory} from "react-router-dom";
import {GetListRoomApi, OutRoom} from "../../apis/room.api";
import {getDetailRoomSuccess, getListRoomSuccess} from "../../store/action/room.action";

const useStyles = makeStyles({
    root: {
        minWidth: '600px',
        '&:hover': {
            overflowY: 'auto'
        },
        '&:hover&::-webkit-scrollbar': {
            width: 10
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: 10
        },
        overflow: 'hidden',
    }
})

interface Props {
    open: boolean
    onClose: any
    onCloseEL: any
}

export default function DialogOutRoom(props: Props) {
    const {open, onClose, onCloseEL} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleOutRoom = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await OutRoom(currentRoom._id, token)

            if (res.status === 200) {
                enqueueSnackbar('Out room success', {
                    variant: 'success'
                });
                handleGetListRoom(token)
                dispatch(getDetailRoomSuccess({}))
            } else {
                enqueueSnackbar('Out room failed', {
                    variant: 'error'
                });
            }
        } else {
            history.push('/')
        }
    }

    const handleGetListRoom = async (token: string) => {
        const res = await GetListRoomApi({}, token)
        if (res.status === 200) {
            dispatch(getListRoomSuccess(res.data))
        } else {
            history.push('/')
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{`Are you sure out group ${currentRoom.title}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you leave the group, you can no longer interact with the group members,
                        Are you sure you want to leave the group?.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOutRoom}>Out</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}