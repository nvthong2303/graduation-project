import React from 'react';
import {makeStyles} from '@mui/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    ImageList,
    ImageListItem,
    Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {GetDetailRoomById, GetListRoomApi, UpdateRoom} from "../../apis/room.api";
import { listImageAvatar } from "../../common";
import { useSnackbar } from "notistack";
import {getDetailRoomSuccess, getListRoomSuccess} from "../../store/action/room.action";
import {useHistory} from "react-router-dom";

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
    },
    errorMessage: {
        fontSize: '12px',
        float: 'left',
        color: '#db0000',
        margin: '2px auto 0 2px'
    },
    boxSelectAvatar: {
        paddingTop: '20px',
        width: '100%',
        display: 'flex',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        padding: 'auto',
        flexDirection: 'column'
    },
    listAvatar: {
    }
})

interface Props {
    open: boolean
    onClose: any
    onCloseEL: any
}

export default function DialogSettingRoom(props: Props) {
    const {open, onClose, onCloseEL} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            title: currentRoom.title,
            description: currentRoom.description,
            avatar: currentRoom.avatar,
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Room name is required!"),
            description: Yup.string()
                .max(40, "Maximum 40 characters"),
            avatar: Yup.string().required("Avatar is required!")
        }),
        onSubmit: values => {
            handleUpdateRoom(values)
        }
    });

    const handleSelectAvatar = (avatar: any) => {
        formik.setFieldValue('avatar', avatar.title)
    }

    const handleUpdateRoom = async (values: any) => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await UpdateRoom({
                id: currentRoom._id,
                title: values.title,
                description: values.description,
                avatar: values.avatar,
            }, token)

            if (res.status === 200) {
                enqueueSnackbar('Update room success', {
                    variant: 'success'
                });
                onClose();
                const res = await GetDetailRoomById(currentRoom._id, token)
                if (res.status === 200) {
                    if (res.data) {
                        dispatch(getDetailRoomSuccess(res.data))
                    }
                }
                handleGetListRoom(token);
                onCloseEL();
            } else {
                enqueueSnackbar('Update room failed', {
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
                <form onSubmit={formik.handleSubmit} className={classes.root}>
                    <DialogTitle>Create new room</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Create a group with friends and colleagues and explore and experience together.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            placeholder="Room name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formik.values.title}
                            onChange={(event) => formik.setFieldValue('title', event.target.value)}
                        />
                        {formik.errors.title && formik.touched.title && (
                            <p className={classes.errorMessage}>{formik.errors.title}</p>
                        )}
                        <TextField
                            margin="dense"
                            id="description"
                            placeholder="Room description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={formik.values.description}
                            onChange={(event) => formik.setFieldValue('description', event.target.value)}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <p className={classes.errorMessage}>{formik.errors.description}</p>
                        )}
                        <div className={classes.boxSelectAvatar}>
                            <Typography sx={{ float: 'left' }} variant="overline">Room avatar</Typography>
                            <ImageList sx={{width: '100%', height: 240}} cols={7} rowHeight={60}
                                       className={classes.listAvatar}>
                                {listImageAvatar.map((item, index) => (
                                    <ImageListItem onClick={() => handleSelectAvatar(item)} key={index} sx={{width: '60px', height: '60px'}}>
                                        <img
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                border: formik.values.avatar === item.title ? '4px solid blue' : 'none'
                                            }}
                                            src={item.src}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </div>
                        {formik.errors.avatar && formik.touched.avatar && (
                            <p className={classes.errorMessage}>{formik.errors.avatar}</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button type='submit'>Update</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}