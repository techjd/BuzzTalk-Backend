import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        groupImage: {
            type: String,
        },
        groupBio: {
            type: String
        },
        lastMessage: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Groups = mongoose.model('groups', GroupSchema)
export default Groups