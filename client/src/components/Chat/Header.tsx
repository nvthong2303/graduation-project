import React from 'react';
import {makeStyles} from "@mui/styles";
import {IconButton, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const useStyles = makeStyles({
    root: {}
})

export default function HeaderChat(props: any) {
    const {room} = props
    const classes = useStyles();

    return (
        <>
            <Typography variant='subtitle2'>{room?.title}</Typography>
            <IconButton sx={{
                width: '24px',
                height: '24px'
            }}>
                <MoreVertIcon />
            </IconButton>
        </>
    )
}