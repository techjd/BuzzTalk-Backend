import mongoose, { Schema } from "mongoose";
import { COMMENTED, POSTED } from "../utils/Constants.js";

const FeedSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            required: true
        },
        type: {
            type: String,
            enum: [COMMENTED, POSTED],
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        toId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Feed = mongoose.model('feed', FeedSchema)
export default Feed