import React from 'react';
import { makeStyles } from '@mui/styles';
import { Card, IconButton, Typography, Tooltip } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';

import math from '../../assets/subjects/math.png';
import {collapseString} from "../../common";
import {useDispatch} from "react-redux";
import {selectRoom} from "../../store/action/room.action";
import {useHistory} from "react-router-dom";
import {PATHS} from "../../constants/paths";

const useStyles = makeStyles({
    root: {
        width: '230px !important',
        height: '235px',
        margin: '24px',
        borderRadius: '8px',
        backgroundColor: '#e2fde3 !important',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px !important',
        transition: 'all .3s ease-in-out',
        "&:hover": {
            transform: 'scale(1.1)'
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 8px 0 16px',
        alignItems: 'center'
    },
    media: {
        height: '140px',
        padding: '16px 24px'
    },
    img: {
        height: '100%',
        width: 'auto'
    },
    action: {
        padding: '0 8px 0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default function Group(props: any) {
    const { room } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSelectRoom = () => {
        dispatch(selectRoom(room))
        history.push(`${PATHS.CHAT}/${room._id}`)
    }

    return (
        <Card className={classes.root} onClick={handleSelectRoom}>
            <div className={classes.header}>
                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '8px' }}>
                    <Tooltip title={room.title}>
                        <Typography variant="subtitle2">{collapseString(room.title, 23, 21)}</Typography>
                    </Tooltip>
                    <Typography variant="caption">{`${room.members.length ?? 0} members`}</Typography>
                </div>
                <div>
                    <IconButton aria-label="settings" size="small">
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className={classes.media}>
                <img className={classes.img} src={math} />
            </div>

            <div className={classes.action}>
                <Tooltip title={room.description}>
                    <Typography variant="caption">{collapseString(room.description, 49, 47)}</Typography>
                </Tooltip>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
            </div>
        </Card>
    )
}