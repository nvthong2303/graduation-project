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
import {User} from "../Header";
import { useSnackbar } from "notistack";
import {DeleteRoom, GetListRoomApi} from "../../apis/room.api";
import {useHistory} from "react-router-dom";
import {getDetailRoomSuccess, getListRoomSuccess} from "../../store/action/room.action";

const useStyles = makeStyles({
    root: {
    }
})

interface Props {
    open: boolean
    onClose: any
    room: any
    onCloseEL: any
}

export default function DialogDeleteRoom(props: Props) {
    const {open, onClose, room, onCloseEL} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await DeleteRoom(room._id, token)
            if (res.status === 200) {
                enqueueSnackbar('Delete room success', {
                    variant: 'success'
                });
                handleGetListRoom(token)
                dispatch(getDetailRoomSuccess({}))
            } else {
                enqueueSnackbar('Delete room failed', {
                    variant: 'error'
                });
                onClose();
                onCloseEL();
            }
        } else {
            history.push('/login')
        }
    }

    const handleGetListRoom = async (token: string) => {
        const res = await GetListRoomApi({}, token)
        if (res.status === 200) {
            dispatch(getListRoomSuccess(res.data))
            onClose();
            onCloseEL();
            history.push('/chat')
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{`Are you sure delete group ${room.title}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        If you delete it, you won't be able to recover it,
                        the group won't be found by anyone else,
                        think twice before deleting.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete}>Delete</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}