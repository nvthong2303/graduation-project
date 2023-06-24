import React from 'react';
import io from 'socket.io-client';
import {room} from "../store/reducer/room.reducer";
import {useDispatch, useSelector} from "react-redux";
import {receiveMessageSuccess} from "../store/action/message.action";

const SOCKET_SERVER_URL = "http://localhost:3002";

const subRoom = [];

let socketRef: React.MutableRefObject<SocketIOClient.Socket | undefined>;
export default function SocketIO(props: any) {
    socketRef = React.useRef<SocketIOClient.Socket>();
    const listRoom: room[] = useSelector((state: any) => state.roomReducer?.listRoom);
    const currentRoom: room = useSelector((state: any) => state.roomReducer?.currentRoom);
    const dispatch = useDispatch();

    React.useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER_URL);

        socketRef.current?.emit("join", "hello world")

        socketRef.current.on(
            "join",
            (data: any) => {
                console.log(data)
            }
        );
    }, []);

    React.useEffect(() => {
        console.log(currentRoom)
        socketRef.current?.emit('join', currentRoom._id)

        socketRef.current?.on('receiveMessage', (content: any) => {
            console.log('///', content)
            dispatch(receiveMessageSuccess(content))
        });
    }, [JSON.stringify(currentRoom)])

    // React.useEffect(() => {
    //     if (socketRef.current && listRoom.length > 0) {
    //         listRoom.map((el: room) => {
    //             const roomId: string = el._id
    //             console.log(roomId)
    //             socketRef.current?.on(
    //                 roomId,
    //                 (data: any) => {
    //                     console.log("======>", data)
    //                     console.log(currentRoom)
    //                     dispatch(receiveMessageSuccess(data))
    //                 }
    //             );
    //             console.log(el)
    //         })
    //     }
    // }, [JSON.stringify(listRoom)])

    return (
        <></>
    )
}

export {
    socketRef
}
