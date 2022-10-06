import mongoose, { Schema } from "mongoose";
import { COMMENT, POST } from "../utils/Constants";

const PostLikesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const PostLikes = mongoose.model('postlikes', PostLikesSchema)
export default PostLikes