import mongoose, { Schema } from "mongoose";
import { COMMENT, POST } from "../utils/Constants";

const CommentLikesSchma = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const CommentLikes = mongoose.model('commentlikes', CommentLikesSchma)
export default CommentLikes