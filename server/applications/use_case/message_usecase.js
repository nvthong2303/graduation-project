import message from '../../src/entities/message'

function fetchMessageByRoom(
    param,
    messageRepository
) {
    const params = {
        room: param.room,
        skip: param.skip,
        limit: param.limit
    }
    return messageRepository.fetchMessageByRoom(params)
}

function sendMessage(
    room,
    sender,
    content,
    messageRepository
) {
    const newMessage = new message(
        content,
        sender,
        room
    )
    return messageRepository.sendMessage(newMessage)
}

const countMessageByRoom = (room, messageRepository) => {
    return messageRepository.countMessageByRoom(room)
}

export {
    fetchMessageByRoom,
    sendMessage,
    countMessageByRoom
}