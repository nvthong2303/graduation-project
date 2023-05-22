import React from 'react';
import {
    AppBar,
    Toolbar,
    InputBase,
    Typography,
    Button,
    Avatar,
    MenuItem,
    Menu,
    Box,
    Tabs,
    Tab
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import teamsIcon from '../assets/images/streaming.png'
import { useDispatch, useSelector } from 'react-redux';
import { GetInfoApi } from "../apis/user.api";
import { getInfoUserSuccess, logoutSuccess } from "../store/action/user.action";
import { useHistory } from "react-router-dom";
import {GetListRoomApi} from "../apis/room.api";
import {getListRoomSuccess} from "../store/action/room.action";

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
    }
})


export default function Header(props: any) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const [value, setValue] = React.useState("group");
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
        const res = await GetListRoomApi(token)
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
        } else if (window.location.href.includes('info')) {
            setValue("more")
        }
    }, [window.location.href])

    const classes = useStyles();

    const handleSearch = (event: any) => {
        console.log(event)
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
                            <SearchIcon style={{ color: '#e0e0e0' }} />
                            <InputBase
                                fullWidth={true}
                                placeholder={'Search ...'}
                                onChange={(event: any) => handleSearch(event)}
                            />
                        </div>
                    </div>
                </div>
                {/* center header */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', height: "40px !important" }}>
                    <Tabs value={value} onChange={handleChange} centered sx={{ height: "40px !important", minHeight: "40px !important" }}>
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