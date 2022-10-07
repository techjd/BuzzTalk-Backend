import express from 'express';
import { login } from '../controllers/authController.js';
import { registerCompany } from '../controllers/companyController.js';
const companyRouter = express.Router();

companyRouter.post('/login', login);
companyRouter.post('/registerCompany', registerCompany);

export default companyRouter;