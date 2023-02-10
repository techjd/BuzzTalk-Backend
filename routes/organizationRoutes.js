import express from 'express';
import { registerOrg, loginOrg, getOrgInfo } from "../controllers/organizationController.js";
import protect from '../middlewares/protect.js';
const orgRouter = express.Router();

orgRouter.post('/login', loginOrg);
orgRouter.post('/register', registerOrg);
orgRouter.get('/getOrgInfo', protect , getOrgInfo)
export default orgRouter;