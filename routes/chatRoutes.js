import express from 'express';
import { createGroup, getAllConversations, getAllMessages, getGroupMessages, getMessagesByDate, getUserGroups, getUserStatus, makeMeOnline, removeMeOnline, sendMessage, sendMessageToGroup } from '../controllers/chatController.js';
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
chatRouter.post('/createGroup', protect, createGroup)
chatRouter.get('/getGroups', protect, getUserGroups)
chatRouter.post('/groups/sendMessage', protect, sendMessageToGroup)
chatRouter.post('/groups/getGroupMessages', protect, getGroupMessages)

export default chatRouter;