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

export default function DialogBase(props: Props) {
    const {open, onClose, onCloseEL} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                    <DialogTitle>Create new room</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Create a group with friends and colleagues and explore and experience together.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button>Update</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogActions>
            </Dialog>
        </>
    )
}