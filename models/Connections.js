import mongoose, { Schema } from "mongoose";
import { REQUEST_ACCEPTED, REQUEST_REJECTED, REQUEST_SENT, UNSEND_REQUEST } from "../utils/Constants.js";

const ConnectionsSchema = new mongoose.Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        to: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        status: {
            type: String,
            enum: [
                REQUEST_SENT,
                REQUEST_ACCEPTED,
                UNSEND_REQUEST,
                REQUEST_REJECTED,
            ],
            required: false
        }
    },
    {
        timestamps: true,
    }
    );
    
    const Connections = mongoose.model('connections', ConnectionsSchema);
    export default Connections;