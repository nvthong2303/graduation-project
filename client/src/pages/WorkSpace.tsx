import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles } from "@mui/styles";
import { Box, Button, Divider } from '@mui/material';

import Header from "../components/Header";
import { GetListRoomApi } from "../apis/room.api";
import AddIcon from '@mui/icons-material/Add';
import Group from "../components/group/group";
import {getListRoomSuccess} from "../store/action/room.action";

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
    const dispatch = useDispatch();
    const listRoom = useSelector((state: any) => state.roomReducer.listRoom) as any;
    const history = useHistory();

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
                    {listRoom.filter((el: any) => el.type !== 'chat').map((el: any, index: any) => (
                        <Group key={index} room={el} />
                    ))}
                </div>
            </Box>
        </div>
    )
}
