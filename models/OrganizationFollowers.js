import mongoose from "mongoose";
const { Schema } = mongoose;

const OrganizationFollowerSchema = new mongoose.Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    orgId: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    }
}, 
{
    timestamps: true
})

const OrganizationFollower = mongoose.model('organizationfollower', OrganizationFollowerSchema)
export default OrganizationFollower