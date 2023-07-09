import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const RoomSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    admin: {
        type: String,
    },
    members: {
        type: [String],
        unique: false
    },
    createdAt: Date,
    updatedAt: Date,
    lastMessage: String,
    lastSender: String,
    avatar: String,
    status: {
        type: String,
        default: 'none'
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'class'
    }
})

RoomSchema.index({ title: 1 })

const RoomModel = mongoose.model("Room", RoomSchema);

RoomModel.ensureIndexes((err) => {
    if (err) {
        return err;
    }
    return true;
})

export default RoomModel;
