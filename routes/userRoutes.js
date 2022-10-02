import express from 'express';
import { acceptRequest, checkIfRequestSentOrNot, checkIfUserFollowedOrNot, connect, follow, getAllConnections, getAllConnectionsRequests, getAllFollowers, getAllFollowersAndFollowing, getAllFollowing, getAllUsers, getInfo, getOthersInfo, unfollow } from '../controllers/userController.js';
import protect from '../middlewares/protect.js';
const userRouter = express.Router();

userRouter.get('/userInfo', protect, getInfo);
userRouter.post('/getOthersInfo', protect, getOthersInfo)
userRouter.get('/getAllUsers', getAllUsers)

// Follow Unfollow User
userRouter.post('/follow', protect, follow)
userRouter.post('/checkIfUserFollowedOrNot', protect, checkIfUserFollowedOrNot)
userRouter.post('/unfollow', protect, unfollow)
userRouter.get('/getAllFollowers', protect, getAllFollowers)
userRouter.get('/getAllFollowing', protect, getAllFollowing)
userRouter.post('/getAllFollowersAndFollowing', protect, getAllFollowersAndFollowing)

// Connections
userRouter.post('/connect', protect, connect)
userRouter.post('/checkIfRequestSentOrNot', protect, checkIfRequestSentOrNot)
userRouter.get('/getAllConnectionsRequest', protect, getAllConnectionsRequests)
userRouter.put('/acceptRequest', protect, acceptRequest)
userRouter.get('/getAllConnections', protect, getAllConnections)

// userRouter.post('/unconnect', protect, )
// userRouter.post('/accept', protect, )
// userRouter.post('/reject', protect, )

export default userRouter;