import React from 'react';
import {makeStyles} from "@mui/styles";
import {IconButton, Typography, Popover, Box, Menu, MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useSelector} from "react-redux";
import DialogSettingRoom from "../Dialog/DialogUpdateRoom";

const useStyles = makeStyles({
    root: {}
})

export default function HeaderChat(props: any) {
    const {room} = props
    const classes = useStyles();
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const currentRoom = useSelector((state: any) => state.roomReducer.currentRoom)
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openUpdateRoom, setOpenUpdateRoom] = React.useState(false);

    const handleOpenPopup = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const handlerGetTitleChatName = () => {
        const listTitle = room.title.split('-')
        if (room.admin === infoUser.email) {
            return listTitle[1]
        } else {
            return listTitle[0]
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
    }

    const handleUpdateRoom = () => {
        setOpenUpdateRoom(true);
    }

    return (
        <>
            <Typography variant='subtitle2'>{room.type === 'chat' ? handlerGetTitleChatName() : room?.title}</Typography>
            <IconButton sx={{
                width: '24px',
                height: '24px'
            }}
            onClick={(event) => handleOpenPopup(event)}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {currentRoom.admin === infoUser.email ? (
                    <>
                        <MenuItem onClick={handleUpdateRoom}>Setting room</MenuItem>
                        <MenuItem onClick={handleClose}>List members</MenuItem>
                        <MenuItem onClick={handleClose}>Delete room</MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem onClick={handleClose}>List members</MenuItem>
                        <MenuItem onClick={handleClose}>Out room</MenuItem>
                    </>
                )}
            </Menu>
            {openUpdateRoom ? (
                <DialogSettingRoom open={openUpdateRoom} onClose={() => setOpenUpdateRoom(false)}/>
            ) : null}
        </>
    )
}
