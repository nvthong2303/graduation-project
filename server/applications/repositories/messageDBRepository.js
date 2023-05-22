export default function messageRepository(repository) {
    const fetchMessageByRoom = (params) => repository.fetchMessageByRoom(params);

    const sendMessage = (body) => repository.sendMessage(body);

    const countMessageByRoom = (room) => repository.countMessageByRoom(room);

    return {
        fetchMessageByRoom,
        sendMessage,
        countMessageByRoom
    }
}