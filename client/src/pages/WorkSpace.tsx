import React from 'react';
import {useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";

import { makeStyles } from "@mui/styles";
import {Box, Button, Divider} from '@mui/material';

import Header from "../components/Header";
import {GetListRoomApi} from "../apis/room.api";
import AddIcon from '@mui/icons-material/Add';
import Group from "../components/group/group";

const useStyles = makeStyles({
    root: {
        backgroundColor: '#a4c4ff',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    workSpace: {
        height: 'calc(100vh - 40px)',
        marginTop: 0,
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        height: '56px',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '16px 48px'
    },
    button: {
        height: '24px'
    },
    listRoom: {
        display: 'flex',
        padding: '24px',
        width: '100%',
        height: '100%',
        flexFlow: 'row wrap',
        overflowY: 'auto'
    }
});

export default function WorkSpace() {
    const classes = useStyles();
    const match = useRouteMatch();
    const [listRoom, setListRoom] = React.useState([]);
    const history = useHistory();

    React.useEffect(() => {
        const userId = localStorage.getItem('_user_id_')
        const token = localStorage.getItem('_token_')
        if (userId && token) {
            handleGetListRoom(token)
        } else {
            history.push('/')
        }
    }, [])

    const handleGetListRoom = async (token: string) => {
        const res = await GetListRoomApi(token)
        if (res.status === 200) {
            setListRoom(res.data);
        }
    }

    const handleOpenPopupCreate = () => {

    }

    return (
        <div className={classes.root}>
            <Header />
            <Box className={classes.workSpace}>
                <div className={classes.header}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        size="small"
                        endIcon={<AddIcon />}
                        onClick={handleOpenPopupCreate}
                    >
                        Create group
                    </Button>
                </div>
                <Divider />
                <div className={classes.listRoom}>
                    {listRoom.map((el, index) => (
                        <Group key={index} room={el} />
                    ))}
                </div>
            </Box>
        </div>
    )
}