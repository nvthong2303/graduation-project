import React from 'react';
import {makeStyles} from "@mui/styles";
import {IconButton, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useSelector} from "react-redux";

const useStyles = makeStyles({
    root: {}
})

export default function HeaderChat(props: any) {
    const {room} = props
    const classes = useStyles();
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);

    const handlerGetTitleChatName = () => {
        const listTitle = room.title.split('-')
        if (room.admin === infoUser.email) {
            return listTitle[1]
        } else {
            return listTitle[0]
        }
    }

    return (
        <>
            <Typography variant='subtitle2'>{room.type === 'chat' ? handlerGetTitleChatName() : room?.title}</Typography>
            <IconButton sx={{
                width: '24px',
                height: '24px'
            }}>
                <MoreVertIcon />
            </IconButton>
        </>
    )
}
