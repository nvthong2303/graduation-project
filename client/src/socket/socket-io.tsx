import React from 'react';
import io from "socket.io-client";

export default function SocketIO(props: any) {

    React.useEffect(() => {
        const socket = io("http://localhost:3002"); // Thay đổi địa chỉ và cổng tới địa chỉ của WebSocket server của bạn

        // Xử lý các sự kiện từ server
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("message", (data: any) => {
            console.log("Received message from server:", data);
        });

        // Để gửi một tin nhắn tới server
        socket.emit("message", "Hello server!");

        // Xử lý khi component bị hủy
        return () => {
            socket.disconnect(); // Ngắt kết nối khi component bị hủy
        };
    }, [])

    return (
        <></>
    )
}