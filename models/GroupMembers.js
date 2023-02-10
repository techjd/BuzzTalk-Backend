import mongoose from "mongoose";

const GroupMembersSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'groups'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    },
    {
        timestamps: true
    }
)

const GroupMembers = mongoose.model('groupmembers', GroupMembersSchema)
export default GroupMembers