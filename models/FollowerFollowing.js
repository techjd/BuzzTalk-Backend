import mongoose from "mongoose";
const { Schema } = mongoose;
import User from "./User.js";

const FollowerFollowingSchema = new mongoose.Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    followeeId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, 
{
    timestamps: true
})

const FollowerFollowing = mongoose.model('FollowerFollowing', FollowerFollowingSchema)
export default FollowerFollowing