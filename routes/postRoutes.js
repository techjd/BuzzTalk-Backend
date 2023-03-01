import express from 'express';
import { login, register } from '../controllers/authController.js';
import multer from 'multer';
import { getImage, uploadImage } from '../controllers/imageController.js';
import { addPost, commentOnPost, getAllSpecificUsersPosts, getComments, getFeed, getMyFeed, getNewFeed, getSinglePost, postNewOpportunitiesCompany, postNewOpportunitiesUniversity, getHashTagPosts, fetchHashTagId, likePost, checkIfUserHasLikedPost } from '../controllers/postController.js';
import protect from '../middlewares/protect.js';
const postRouter = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

postRouter.post('/addPost', protect, addPost);
postRouter.get('/getAllSpecificUserPosts', getAllSpecificUsersPosts)
postRouter.get('/getFeed',protect, getFeed)
postRouter.post('/postNewOpportunitites', protect, postNewOpportunitiesCompany)
postRouter.post('/postNewOpportunititesUniversity', protect, postNewOpportunitiesUniversity)

postRouter.get('/getLatestFeed', protect, getNewFeed)
postRouter.get('/myFeed', protect, getMyFeed)
postRouter.get('/singlePost/:id', getSinglePost)

postRouter.post('/comment', protect, commentOnPost)
postRouter.get('/getComments/:postId', getComments)
postRouter.post('/getHashTagPosts', protect, getHashTagPosts)
postRouter.post('/getHashTagId', fetchHashTagId)

// authRouter.post('/post/:id', protect);
postRouter.post('/like', protect, likePost);
postRouter.post('/isLiked', protect, checkIfUserHasLikedPost)
// authRouter.get('/post/dislike/:id', protect)

postRouter.post('/uploadImage', upload.single('image'), uploadImage)
postRouter.post('/getImage', getImage)

export default postRouter;