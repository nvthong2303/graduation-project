import React from 'react';
import {makeStyles} from '@mui/styles';
import {
    Autocomplete, Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    ImageList,
    ImageListItem,
    Typography
} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import { SearchUserByUsername } from "../../apis/user.api";
import {CreateRoom, GetListRoomApi} from "../../apis/room.api";
import {User} from "../Header";
import { getSrcAvatarRoom, listImageAvatar } from "../../common";
import { useSnackbar } from "notistack";
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
}

export default function DialogCreateRoom(props: Props) {
    const {open, onClose} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const [listUserSearch, setListUserSearch] = React.useState<User[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            avatar: "",
            members: [],
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Room name is required!"),
            description: Yup.string()
                .max(40, "Maximum 40 characters"),
            members: Yup.array().min(3, "Minimum 3 members"),
            avatar: Yup.string().required("Avatar is required!")
        }),
        onSubmit: values => {
            handleCreateRoom(values)
        }
    });

    const onSelectUser = (users: any) => {
        formik.setFieldValue('members', users)
    }
    const handleSearchUser = (value: any) => {
        if (value.length > 0) {
            searchUser(value);
        }
    };

    const searchUser = _.debounce(async (value) => {
        const token = localStorage.getItem('_token_')
        try {
            if (token) {
                const res = await SearchUserByUsername(value, token);

                if (res.status === 200 && res.data?.data?.length > 0) {
                    const listUser: User[] = []
                    res.data.data.map((el: any) => {
                        listUser.push({
                            ...el,
                            type: 'user'
                        })
                    })
                    console.log('list', listUser)
                    setListUserSearch(listUser)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }, 1000);

    const handleSelectUser = (user: any) => {
        if (formik.values.members.map((el: any) => el.email).includes(user.email)) return
        formik.setFieldValue('members', [...formik.values.members, user])
    };

    const handleSelectAvatar = (avatar: any) => {
        formik.setFieldValue('avatar', avatar.title)
    }

    const handleCreateRoom = async (values: any) => {
        const token = localStorage.getItem('_token_')
        if (token) {
            const res = await CreateRoom({
                title: values.title,
                description: values.description,
                avatar: values.avatar,
                members: values.members.map((el : any) => el.email)
            }, token)

            if (res.status === 200) {
                handleGetListRoom(token)
                enqueueSnackbar('Create room success', {
                    variant: 'success'
                });
                onClose();
            } else {
                enqueueSnackbar('Create room failed', {
                    variant: 'error'
                });
            }
        }
    }

    const handleGetListRoom = async (token: string) => {
        const res = await GetListRoomApi({}, token)
        if (res.status === 200) {
            dispatch(getListRoomSuccess(res.data))
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
                        <Autocomplete
                            multiple
                            style={{
                                marginTop: '20px'
                            }}
                            id="size-small-standard-multi"
                            size="small"
                            options={listUserSearch}
                            value={formik.values.members}
                            getOptionLabel={(option) => option.username}
                            onChange={(event, value) => {
                                onSelectUser(value);
                            }}
                            onInputChange={(event, newValue) => {
                                handleSearchUser(newValue);
                            }}
                            noOptionsText="Input to search user"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin="dense"
                                    id="description"
                                    placeholder="Search users"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                />
                            )}
                            renderOption={(props, option) => {
                                return (
                                    <ListItem
                                        key={option._id}
                                        sx={{
                                            height: '48px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleSelectUser(option)}
                                    >
                                        <ListItemAvatar>
                                            {option.type === 'user' ? (
                                                <Avatar
                                                    sx={{
                                                        width: '30px',
                                                        height: '30px'
                                                    }}
                                                >{option.username[0]}</Avatar>
                                            ) : (
                                                <Avatar
                                                    sx={{
                                                        width: '30px',
                                                        height: '30px'
                                                    }}
                                                    variant="square"
                                                    src={getSrcAvatarRoom(option.avatar ?? '')}
                                                />
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText secondary={option.username}/>
                                    </ListItem>
                                );
                            }}
                        />
                        {formik.errors.members && formik.touched.members && (
                            <p className={classes.errorMessage}>{formik.errors.members}</p>
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
                        <Button type='submit'>Create</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}