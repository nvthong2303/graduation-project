import React from 'react';
import io from 'socket.io-client';
import {room} from "../store/reducer/room.reducer";
import {useDispatch, useSelector} from "react-redux";
import {receiveMessageSuccess} from "../store/action/message.action";
import {SOCKET_SERVER_URL} from "../utils/config";

const subRoom = [];

let socketRef: React.MutableRefObject<SocketIOClient.Socket | undefined>;
export default function SocketIO(props: any) {
    socketRef = React.useRef<SocketIOClient.Socket>();
    const listRoom: room[] = useSelector((state: any) => state.roomReducer?.listRoom);
    const currentRoom: room = useSelector((state: any) => state.roomReducer?.currentRoom);
    const dispatch = useDispatch();
    const [connected, setConnected] = React.useState(false)

    React.useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io.connect(SOCKET_SERVER_URL);
        }

        socketRef.current.on("connect", () => {
            setConnected(true)
        })

        socketRef.current.on('connect_error', (error: any) => {
            // isConnected = false;
            console.log('connect socket failed:', error.message);
            setTimeout(() => {
                console.log("reConnect socket")
                socketRef.current = io.connect(SOCKET_SERVER_URL);
            }, 15000);
        });

        socketRef.current?.emit("join", "hello world")

        socketRef.current.on(
            "join",
            (data: any) => {
                console.log(data)
            }
        );
    }, []);

    React.useEffect(() => {
        if (currentRoom._id) {
            socketRef.current?.emit('join', currentRoom._id)

            socketRef.current?.on('receiveMessage', (content: any) => {
                dispatch(receiveMessageSuccess(content))
            });
        }
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
