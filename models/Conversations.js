import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    recipients: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'users' 
        }
    ],
    lastMessage: {
        type: String,
    }
},
{
    timestamps: true
});

const Conversations = mongoose.model('conversations', ConversationSchema)
export default Conversations