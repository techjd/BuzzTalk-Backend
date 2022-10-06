import mongoose, { Schema } from "mongoose";

const HashTagFeedSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            required: true
        },
        hashtagId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hashtags',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const HashTagsFeed = mongoose.model('hashtagfeed', HashTagFeedSchema)
export default HashTagsFeed