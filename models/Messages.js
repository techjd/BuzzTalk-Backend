import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversations',
      },
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      body: {
        type: String,
        required: true,
      },
},
{
    timestamps: true
})

const Messages = mongoose.model('messages', MessageSchema)
export default Messages