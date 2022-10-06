import express from 'express';
import { login, register } from '../controllers/authController.js';
import { addPost, getAllSpecificUsersPosts, getFeed } from '../controllers/postController.js';
import protect from '../middlewares/protect.js';
const postRouter = express.Router();

postRouter.post('/addPost', protect, addPost);
postRouter.get('/getAllSpecificUserPosts', getAllSpecificUsersPosts)
postRouter.get('/getFeed',protect, getFeed)
// authRouter.post('/post/:id', protect);
// authRouter.put('/post/like/:id', protect);
// authRouter.get('/post/dislike/:id', protect)

export default postRouter;