import mongoose from "mongoose";

const OnlineUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  socketId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true
});

const OnlineUsers = mongoose.model('onlineusers', OnlineUserSchema);
export default OnlineUsers