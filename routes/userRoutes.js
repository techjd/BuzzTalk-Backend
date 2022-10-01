import express from 'express';
import { checkIfUserFollowedOrNot, follow, getAllFollowers, getAllFollowersAndFollowing, getAllFollowing, getAllUsers, getInfo, getOthersInfo, unfollow } from '../controllers/userController.js';
import protect from '../middlewares/protect.js';
const userRouter = express.Router();

userRouter.get('/userInfo', protect, getInfo);
userRouter.post('/getOthersInfo', protect, getOthersInfo)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.post('/follow', protect, follow)
userRouter.post('/checkIfUserFollowedOrNot', protect, checkIfUserFollowedOrNot)
userRouter.post('/unfollow', protect, unfollow)
userRouter.get('/getAllFollowers', protect, getAllFollowers)
userRouter.get('/getAllFollowing', protect, getAllFollowing)
userRouter.get('/getAllFollowersAndFollowing', protect, getAllFollowersAndFollowing)
export default userRouter;