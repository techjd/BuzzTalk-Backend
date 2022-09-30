import express from 'express';
import { login, register } from '../controllers/authController.js';
const authRouter = express.Router();

authRouter.post('/post', login);
authRouter.get('/post/:id', register);
authRouter.put('/post/like/:id', );
authRouter.get('/post/')
export default authRouter;