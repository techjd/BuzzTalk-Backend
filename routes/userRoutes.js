import express from 'express';
import { acceptRequest, checkIfRequestSentOrNot, checkIfUserFollowedOrNot, connect, disconnect, follow, getAllConnections, getAllConnectionsRequests, getAllFollowers, getAllFollowersAndFollowing, getAllFollowing, getAllUsers, getInfo, getOthersInfo, getUserName, reject, sendNotiToken, unfollow } from '../controllers/userController.js';
import protect from '../middlewares/protect.js';
const userRouter = express.Router();

userRouter.get('/userInfo', protect, getInfo);
userRouter.post('/getOthersInfo', protect, getOthersInfo)
userRouter.get('/getAllUsers', getAllUsers)

// Follow Unfollow User
userRouter.post('/follow', protect, follow)
userRouter.post('/checkIfUserFollowedOrNot', protect, checkIfUserFollowedOrNot)
userRouter.post('/unfollow', protect, unfollow)
userRouter.post('/getAllFollowers', protect, getAllFollowers)
userRouter.post('/getAllFollowing', protect, getAllFollowing)
userRouter.post('/getAllFollowersAndFollowing', protect, getAllFollowersAndFollowing)

// Connections
userRouter.post('/connect', protect, connect)
userRouter.post('/checkIfRequestSentOrNot', protect, checkIfRequestSentOrNot)
userRouter.get('/getAllConnectionsRequest', protect, getAllConnectionsRequests)
userRouter.put('/acceptRequest', protect, acceptRequest)
userRouter.post('/getAllConnections', protect, getAllConnections)

// For Notification
userRouter.post('/sendNotiToken', protect, sendNotiToken)

userRouter.get('/getUserNames', protect, getUserName)

userRouter.post('/disconnect', protect, disconnect)
userRouter.delete('/reject', protect, reject)

export default userRouter;