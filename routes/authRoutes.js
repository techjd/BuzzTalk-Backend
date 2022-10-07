import express from 'express';
import { login, loginCompany, loginUniversity, register } from '../controllers/authController.js';
const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/company/login', loginCompany)
authRouter.post('/university/login', loginUniversity)
export default authRouter;