import express from 'express';
import { getAllConversations, getAllMessages, getMessagesByDate, getUserStatus, makeMeOnline, removeMeOnline, sendMessage } from '../controllers/chatController.js';
import protect from '../middlewares/protect.js';
const chatRouter = express.Router();

chatRouter.post('/makeMeOnline', protect, makeMeOnline);
chatRouter.delete('/removeMeOnline', protect, removeMeOnline)
chatRouter.post('/sendMessage', protect, sendMessage)
chatRouter.post('/getAllMessages', protect, getAllMessages)
chatRouter.get('/getAllConversations', protect, getAllConversations)
chatRouter.post('/getUserStatus', protect, getUserStatus)
chatRouter.get('/getMessagesByDate', protect, getMessagesByDate)
// chatRouter.post('/register', register);

export default chatRouter;