const MessageModel = require("../../models/message.model");

const handleSaveMessage = async (message) => {
    const newMessage = new MessageModel({
        content: message.content,
        sender: message.sender,
        senderName: message.senderName,
        room: message.room,
        createdAt: message.createdAt
    })

    return newMessage.save();
}

module.exports = {
    handleSaveMessage
}

