import mongoose, {Schema} from "mongoose";

const CommentSchema = new mongoose.Schema(
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
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
)

const Comments = mongoose.model('comments', CommentSchema)
export default Comments