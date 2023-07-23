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

const handleDeleteMessage = async (id) => {
    return MessageModel.findByIdAndDelete(id)
}

module.exports = {
    handleSaveMessage,
    handleDeleteMessage
}

