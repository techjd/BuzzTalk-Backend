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
        title: {
            type: String,
            required: true
        },
        postsFor: [ {
                type: String,
                required: true
            }
        ],
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Posts = mongoose.model('posts', PostSchema)
export default Posts