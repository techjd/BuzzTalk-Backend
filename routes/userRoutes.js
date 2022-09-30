import express from 'express';
import { getAllUsers, getInfo } from '../controllers/userController.js';
import protect from '../middlewares/protect.js';
const userRouter = express.Router();

userRouter.get('/userInfo', protect, getInfo);
userRouter.get('/getAllUsers', getAllUsers)

export default userRouter;