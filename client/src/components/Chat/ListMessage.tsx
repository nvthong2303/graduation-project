import React from 'react';
import {makeStyles} from "@mui/styles";
import {GetListMessageByRoomIdApi} from "../../apis/message.api";
import {useDispatch, useSelector} from "react-redux";
import {getListMessageSuccess} from "../../store/action/message.action";
// @ts-ignore
import InfiniteScroll from "react-infinite-scroll-component";
import {Box, CircularProgress, Typography} from "@mui/material";
import MessageItem from "./MessageItem";
import {message} from "../../store/reducer/messge.reducer";

const useStyles = makeStyles({
    root: {
        height: '100%',
        overflowY: 'hidden',
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
        width: '100%',
        // overflow: 'hidden',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
    }
})

export default function ListMessage(props: any) {
    const {room} = props
    const classes = useStyles();
    const token = localStorage.getItem("_token_")
    const listMessage: message[] = useSelector((state: any) => state.messageReducer?.listMessage);
    const infoUser = useSelector((state: any) => state.userReducer.userInfo);
    const [limit, setLimit] = React.useState(20)
    const [total, setTotal] = React.useState(0)
    const [hasMore, setHasMore] = React.useState(true);
    const [first, setFirst] = React.useState(true);

    const listRef: any = React.useRef();

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (room._id) {
            handleGetListMessage(0, 20)
        }
    }, [room._id])

    React.useEffect(() => {
        if (total && total == listMessage.length)  {
            setHasMore(false)
        }
    }, [listMessage.length])

    const handleGetListMessage = async (skip: number, limit: number) => {
        if (token) {
            const res = await GetListMessageByRoomIdApi(room._id, token, skip, limit)

            if (res.status === 200) {
                dispatch(getListMessageSuccess(res.data.messages ?? []))
                setTotal(res.data.total)

                if (res.data.total === 0) {
                    setHasMore(false)
                }
            }

        }
    }

    function funcLoad() {
        handleGetListMessage(listMessage.length, 20);
    }

    function renderMessageItems() {
        let messagesItems = listMessage.map((item: message, index) => {
            let position = item.sender === infoUser.email ? 'right' : 'left';

            return (
                <MessageItem
                    key={index}
                    position={position as any}
                    message={item.content}
                    sender={item.senderName}
                />
            );
        });
        return messagesItems;
    }

    function renderNoMessage() {
        return (
            <>
                <Typography>{room.lastMessage}</Typography>
            </>
        )
    }

    return (
        <div ref={listRef} className={classes.root} id="scrollableDiv">
            <InfiniteScroll
                dataLength={listMessage.length}
                next={funcLoad}
                style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden' }}
                inverse={true}
                hasMore={hasMore}
                loader={
                    <Box
                        style={{
                            height: '64px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CircularProgress size={25} />
                    </Box>
                }
                scrollableTarget="scrollableDiv"
            >
                {listMessage.length > 0 ? renderMessageItems() : renderNoMessage()}
            </InfiniteScroll>
        </div>
    )
}
