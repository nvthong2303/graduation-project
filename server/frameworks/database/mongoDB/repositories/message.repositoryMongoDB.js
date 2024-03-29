import MessageModel from "../models/message.model";

export default function messageRepositoryMongoDB() {
    const fetchMessageByRoom = (params) => {
        return MessageModel.find({
            room: params.room
        })
            .sort({ createdAt: -1 })
            .skip(parseInt(params.skip, 10))
            .limit(parseInt(params.limit, 10))
    }

    const sendMessage = (messageEntities) => {
        const newMessage = new MessageModel({
            content: messageEntities.getContent(),
            sender: messageEntities.getSender(),
            senderName: messageEntities.getSenderName(),
            room: messageEntities.getRoom(),
        })

        return newMessage.save();
    }

    const countMessageByRoom = (room) => {
        return MessageModel.countDocuments({ room: room })
    }

    return {
        fetchMessageByRoom,
        sendMessage,
        countMessageByRoom
    }
}

