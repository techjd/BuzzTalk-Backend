import mongoose from "mongoose";
import { COMMENTED, LIKED, TAGGED } from "../utils/Constants.js";

const NotificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        text: {
            type: String,
            enum: [
                LIKED,
                COMMENTED,
                TAGGED,
            ],
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

const Notifications = mongoose.model('notifications', NotificationSchema);
export default Notifications