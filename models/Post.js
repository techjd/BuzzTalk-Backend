import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number
        },
        comments: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
)

const Posts = mongoose.model('posts', PostSchema)
export default Posts