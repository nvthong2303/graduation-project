import React from 'react';
import {
    AppBar,
    Toolbar,
    InputBase,
    Typography,
    Button,
    Avatar,
    MenuItem,
    Menu
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import teamsIcon from '../assets/images/streaming.png'
import { useDispatch, useSelector } from 'react-redux';

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
        minWidth: '400px'
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
    const dispatch = useDispatch();

    React.useEffect(() => {

    }, [])

    const classes = useStyles();

    const handleChange = (event: any) => {
        console.log(event)
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('email')
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
                            onChange={(event: any) => handleChange(event)}
                        />
                    </div>
                </div>
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