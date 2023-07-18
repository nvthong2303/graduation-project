import React from 'react';
import {makeStyles} from '@mui/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Tooltip,
    TextField,
    Autocomplete,
    Divider,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { useSnackbar } from "notistack";
import {userInfo} from "os";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {GetListUserByEmails, SearchUserByUsername} from "../../apis/user.api";
import {useHistory} from "react-router-dom";
import {getSrcAvatarRoom} from "../../common";
import _ from "lodash";
import {User} from "../Header";
import {AddMembersRoom, GetDetailRoomById, RemoveMembersRoom} from "../../apis/room.api";
import {getDetailRoomSuccess} from "../../store/action/room.action";

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

export default function DialogMembers(props: Props) {
    const {open, onClose, onCloseEL} = props
    const classes = useStyles();
    const user = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();
    const [users, setUsers] = React.useState<User[]>([]);
    const [admin, setAdmin] = React.useState(false);
    const [usersSearch, setUsersSearch] = React.useState<User[]>([]);
    const [keywords, setKeywords] = React.useState('');

    React.useEffect(() => {
        if (currentRoom.admin === user.email) {
            setAdmin(true)
        }
        handleGetListMembers()
    }, []);

    const handleGetListMembers = async () => {
        const token = localStorage.getItem('_token_')
        const emails = currentRoom.members.toString()
        if (token) {
            const res = await GetListUserByEmails(emails, token)

            if (res.status === 200) {
                setUsers(res.data.users)
            }

        } else {
            history.push('/login')
        }
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
                    res.data.data
                        .filter((el: User) =>
                            !users
                                .map(u => u.email)
                                .includes(el.email)
                        )
                        .map((el: any) => {
                            listUser.push({
                                ...el,
                                type: 'user'
                            })
                        })
                    setUsersSearch(listUser)
                }
            } else {
                history.push('/login')
            }
        } catch (err) {
            console.log(err)
        }
    }, 1000);

    const handleSelectUser = (user: any) => {
        if (users.map((el: any) => el.email).includes(user.email)) {} else {
            setUsers([...users, user]);
            setUsersSearch([]);
            setKeywords('')
        }
    };

    const handleDeleteUser = (user: any) => {
        setUsers((prev) => {
            return prev.filter(el => el.email !== user.email)
        })
    }

    const handleUpdateRoom = async () => {
        const prevEmails = currentRoom.members
        const listMembersAdded = users
            .map(el => el.email)
            .filter(el => !prevEmails.includes(el))
        const listMembersRemoved = prevEmails
            .filter((el: any) =>
                !users
                    .map(el => el.email)
                    .includes(el)
                && el !== currentRoom.admin)
        const token = localStorage.getItem('_token_')
        if (token) {
            const res1 = await AddMembersRoom(listMembersAdded, currentRoom._id, token)
            const res2 = await RemoveMembersRoom(listMembersRemoved, currentRoom._id, token)

            if (res1.status === 200 && res2.status === 200) {
                enqueueSnackbar('Edit list members success', {
                    variant: 'success'
                });

                const res = await GetDetailRoomById(currentRoom._id, token)
                if (res.status === 200) {
                    if (res.data) {
                        dispatch(getDetailRoomSuccess(res.data))
                    }
                }

                onClose();
                onCloseEL();
            } else {
                enqueueSnackbar('Edit list members failed', {
                    variant: 'error'
                });
            }
        } else {
            history.push('/login')
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{`List members of ${currentRoom.title}`}</DialogTitle>
                <DialogContent>
                    {admin ? (
                        <>
                            <Typography>Add members:</Typography>
                            <Autocomplete
                                id="size-small-standard-multi"
                                size="small"
                                options={usersSearch}
                                getOptionLabel={(option) => option.username}
                                onInputChange={(event, newValue) => {
                                    handleSearchUser(newValue);
                                    setKeywords(newValue);
                                }}
                                noOptionsText={keywords.length > 0 ? "Not found" : "Input to search user"}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        margin="dense"
                                        id="description"
                                        placeholder="Search users to add"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={keywords}
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
                        </>
                    ) : null}
                    <Typography sx={{ marginTop: '20px' }}>List members:</Typography>
                    <List>
                        {users.map((el: any) => (
                                <ListItem key={el._id} disablePadding>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {el.username[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={el.username} secondary={el.email} />

                                    {admin ? (
                                        <IconButton aria-label="comment" onClick={() => handleDeleteUser(el)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    ) : null}
                                </ListItem>
                            ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    {admin ? <Button onClick={handleUpdateRoom}>Update</Button> : null}
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}