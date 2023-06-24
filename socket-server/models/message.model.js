const mongoose = require('mongoose');

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


const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
