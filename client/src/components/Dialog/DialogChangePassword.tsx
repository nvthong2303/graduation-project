import React from 'react';
import {makeStyles} from '@mui/styles';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {ChangePasswordApi} from "../../apis/user.api";
import {logoutSuccess} from "../../store/action/user.action";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: '300px !important',
        height: '200px !important'
    }
})

interface Props {
    open: boolean
    onClose: any
}

export default function DialogChangePassword(props: Props) {
    const {open, onClose} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const [pw, setPw] = React.useState('');
    const history = useHistory();

    const handleChangePassword = async () => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await ChangePasswordApi(pw, token)

            if (res.status === 200) {
                enqueueSnackbar("Change password success", {
                    variant: 'success'
                })
                localStorage.removeItem('_token_');
                localStorage.removeItem('_user_id_');
                dispatch(logoutSuccess())
                history.push('/')
                onClose()
            }
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <div className={classes.root}>
                <DialogTitle>Change password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="New password"
                        placeholder="New password"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={pw}
                        onChange={(event) => setPw(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleChangePassword}>Change</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}