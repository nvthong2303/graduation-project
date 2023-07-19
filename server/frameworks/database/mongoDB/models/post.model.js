import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
        // maxlength: 1500,
        // minlength: 60
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    like: {
        type: Array,
        default: []
    },
    attachments: {
        type: Array,
        default: []
    },
    categories: {
        type: String,
        default: 'More'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: Array,
        default: []
    }
})

PostSchema.index({ content: 1 })

const PostModel = mongoose.model("Post", PostSchema);

PostModel.ensureIndexes((err) => {
    if (err) {
        return err;
    }
    return true;
})

export default PostModel;