import express from 'express';
import { login, register } from '../controllers/authController.js';
import { addPost, getAllSpecificUsersPosts, getFeed, getMyFeed, getNewFeed, postNewOpportunitiesCompany, postNewOpportunitiesUniversity } from '../controllers/postController.js';
import protect from '../middlewares/protect.js';
const postRouter = express.Router();

postRouter.post('/addPost', protect, addPost);
postRouter.get('/getAllSpecificUserPosts', getAllSpecificUsersPosts)
postRouter.get('/getFeed',protect, getFeed)
postRouter.post('/postNewOpportunitites', protect, postNewOpportunitiesCompany)
postRouter.post('/postNewOpportunititesUniversity', protect, postNewOpportunitiesUniversity)

postRouter.get('/getLatestFeed', protect, getNewFeed)
postRouter.get('/myFeed', protect, getMyFeed)
// authRouter.post('/post/:id', protect);
// authRouter.put('/post/like/:id', protect);
// authRouter.get('/post/dislike/:id', protect)

export default postRouter;