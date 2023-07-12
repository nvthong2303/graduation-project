import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Avatar,
    MenuItem,
    Menu,
    Box,
    Tabs,
    Tab,
    Autocomplete,
    TextField,
    CircularProgress,
    IconButton, ListItem, ListItemText, ListItemAvatar, Divider
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import teamsIcon from '../assets/images/streaming.png'
import { useDispatch, useSelector } from 'react-redux';
import {GetInfoApi, SearchUserByUsername} from "../apis/user.api";
import { getInfoUserSuccess, logoutSuccess } from "../store/action/user.action";
import { useHistory } from "react-router-dom";
import {GetListRoomApi} from "../apis/room.api";
import {getListRoomSuccess} from "../store/action/room.action";
import _ from 'lodash';
import {getSrcAvatarRoom} from "../common";
import {PATHS} from "../constants/paths";

const useStyles = makeStyles({
    header: {
        height: 40,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '100% !important',
        minHeight: '40px !important',
        background: 'linear-gradient(45deg, #fcfcfc 30%, #ffcfcf 90%)',
        boxShadow: '0px 15px 10px -15px #111'
    },
    root: {
        height: 32,
        justifyContent: 'space-between',
        display: 'flex',
        minWidth: '250px'
    },
    searchInput: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 32,
        marginLeft: '10px',
        borderRadius: 8,
        border: '0.1px solid #ccc',
        backgroundColor: '#ffffff'
    },
    homeButton: {
        display: 'flex',
        color: '#e0e0e0'
    },
    inputSearch: {
        borderRadius: '40px !important',
        '&:hover': {
            cursor: 'text'
        }
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `transparent !important`
        },
        borderRadius: '40px !important',
        width: '100%'
    },
    notchedOutline: {
        border: 'none !important',
        borderRadius: '40px'
    },
    multilineColor: {
        fontSize: 13
    },
    popupIndicator: {
        display: 'none'
    }
})

export interface User {
    username: string;
    email: string;
    role?: string;
    avatar?: string;
    _id?: string;
    type: string;
}


export default function Header(props: any) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const [value, setValue] = React.useState("group");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [listUsers, setListUsers] = React.useState<readonly User[]>([]);
    const [listRooms, setListRooms] = React.useState<readonly User[]>([]);
    const [listOptions, setListOptions] = React.useState<readonly User[]>([]);
    const [key, setKey] = React.useState<string>('');

    const dispatch = useDispatch();
    const history = useHistory();

    React.useEffect(() => {
        const userId = localStorage.getItem('_user_id_')
        const token = localStorage.getItem('_token_')
        if (userId && token && !infoUser.fullName) {
            handleGetInfo(userId, token)
        }
    }, [])

    React.useEffect(() => {
        const userId = localStorage.getItem('_user_id_')
        const token = localStorage.getItem('_token_')
        if (userId && token && !infoUser.fullName) {
            handleGetInfo(userId, token)
        }
        if (userId && token) {
            handleGetListRoom(token)
        } else {
            history.push('/')
        }
    }, [])

    const handleGetListRoom = async (token: string) => {
        const res = await GetListRoomApi({}, token)
        if (res.status === 200) {
            dispatch(getListRoomSuccess(res.data))
        } else {
            history.push('/')
        }
    }

    const handleGetInfo = async (id: string, token: string) => {
        const res = await GetInfoApi(id, token)

        if (res.status === 200) {
            dispatch(getInfoUserSuccess({
                user: res.data,
                token
            }))
        }
    }

    React.useEffect(() => {
        if (window.location.href.includes('chat')) {
            setValue("chat")
        } else if (window.location.href.includes('group')) {
            setValue("group")
        } else if (window.location.href.includes('general')) {
            setValue("general")
        }
    }, [window.location.href])

    React.useEffect(() => {
        if (key.length > 0) {
            setListOptions([...listUsers, ...listRooms])
        } else {
            setListOptions([])
        }
    }, [JSON.stringify(listUsers), JSON.stringify(listRooms), key])

    const classes = useStyles();

    const handleSearch = (event: any) => {
        if (event.length > 0) {
            searchUser(event)
        } else {
            setListOptions([])
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (newValue !== value) {
            if (newValue === 'chat') {
                history.push('/chat');
            } else if (newValue === 'group') {
                history.push('/group');
            } else {
                if (newValue === 'general') {
                    history.push('/general')
                }
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('_token_');
        localStorage.removeItem('_user_id_');
        dispatch(logoutSuccess())
        history.push('/')
    }

    function handleClickAvatar(event: any) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const searchUser = _.debounce(async function (value: any) {
        const token = localStorage.getItem('_token_')
        try {
            if (token) {
                const res = await SearchUserByUsername(value, token);
                const res_ = await GetListRoomApi({ title: value, isSearch: true }, token);

                if (res.status === 200 && res.data?.data?.length > 0) {
                    const listUser: User[] = []
                    res.data.data.map((el: any) => {
                        listUser.push({
                            ...el,
                            type: 'user'
                        })
                    })
                    setListUsers(listUser)
                }

                if (res_.status === 200 && res_.data?.length > 0) {
                    const listRoom: User[] = []
                    res_.data.map((el: any) => {
                        listRoom.push({
                            username: el.title,
                            avatar: el.avatar,
                            _id: el._id,
                            type: 'class',
                            email: ''
                        })
                    })
                    setListRooms(listRoom)
                }

            }
        } catch (err) {
            console.log(err)
        }
    }, 1000);

    const handleSelectConversation = (option: User) => {
        if (option.type === 'user') {
            history.push(`${PATHS.CHAT}/user/${option.email}`)
        } else {
            history.push(`${PATHS.CHAT}/${option._id}`)
        }
    }


    return (
        <AppBar className={classes.header} position="static">
            <Toolbar className={classes.toolbar}>
                {/*left header */}
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Button className={classes.homeButton}>
                        <img src={teamsIcon} style={{ width: '24px', height: 'auto' }} />
                        <Typography sx={{ color: '#000000', marginLeft: '4px' }}>Home</Typography>
                    </Button>
                    <div className={classes.root}>
                        <div className={classes.searchInput}>
                            <Autocomplete
                                fullWidth={true}
                                size="small"
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                getOptionLabel={(option: any) => option.username}
                                options={listOptions}
                                loading={loading}
                                onInputChange={(event, newValue: any, reason) => {
                                    handleSearch(newValue);
                                    setKey(newValue)
                                }}
                                classes={{
                                    popupIndicator: classes.popupIndicator
                                }}
                                renderInput={params => (
                                    <TextField
                                        classes={{ root: classes.inputSearch }}
                                        {...params}
                                        placeholder="Search user, class ..."
                                        InputLabelProps={{ shrink: false }}
                                        InputProps={{
                                            ...params.InputProps,
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                notchedOutline: classes.notchedOutline
                                            },
                                            className: classes.multilineColor,
                                            startAdornment: (
                                                <React.Fragment>
                                                    {loading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : (
                                                        <IconButton size="small">
                                                            <i className="fas fa-search"></i>
                                                        </IconButton>
                                                    )}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }}
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
                                            onClick={() => handleSelectConversation(option)}
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
                                            <ListItemText secondary={option.username} />
                                        </ListItem>
                                    );
                                }}
                                groupBy={(option) => option.type}
                            />
                        </div>
                    </div>
                </div>
                {/* center header */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', height: "40px !important" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        centered
                        sx={{ height: "40px !important", minHeight: "40px !important" }}
                    >
                        <Tab
                            label="Chat"
                            value="chat"
                        />
                        <Tab
                            label="Group"
                            value="group"
                        />
                        <Tab
                            label="General"
                            value="general"
                        />
                    </Tabs>
                </Box>
                {/* right header */}
                <Button onClick={(e) => handleClickAvatar(e)}>
                    <Typography variant='body2' sx={{
                        color: '#000000',
                        marginRight: '8px',
                        textTransform: 'none'
                    }} >Hi! {infoUser.fullName}</Typography>
                    <Avatar sx={{ width: '24px', height: '24px' }} />
                </Button>
            </Toolbar>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: handleClose }}
            >
                <MenuItem onClick={() => {
                    console.log('next link setting user')
                }}>Setting profile</MenuItem>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
            </Menu>
        </AppBar>
    )
}
