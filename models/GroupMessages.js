import mongoose from "mongoose";

const GroupMessagesSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'groups',
            required: true
        }
    },
    {
        timestamps: true
    }
)

const GroupMessages = mongoose.model('groupmessages', GroupMessagesSchema)
export default GroupMessages