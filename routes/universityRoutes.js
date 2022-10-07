import express from 'express';
import { login } from '../controllers/authController.js';
import { registerUniversity } from '../controllers/universityController.js';
const universityRouter = express.Router();

universityRouter.post('/login', login);
universityRouter.post('/registerUniversity', registerUniversity);

export default universityRouter;