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
    post: any
    handleDelete: any
}

export default function DialogDeletePost(props: Props) {
    const {open, onClose, post, handleDelete } = props
    const classes = useStyles();
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{`Are you sure delete post ${post.title}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        If you delete the post, you won't be able to recover it,
                        are you sure you want to delete it?.
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