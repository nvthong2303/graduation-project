import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


MessageSchema.index({ room: 1 })
const MessageModel = mongoose.model("Message", MessageSchema);

MessageModel.ensureIndexes((err) => {
    if (err) {
        return err;
    }
    return true;
})

export default MessageModel;
