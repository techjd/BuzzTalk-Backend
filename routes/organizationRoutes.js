import express from 'express';
import { registerOrg, loginOrg, getOrgInfo, createOppo, getAllOppo } from "../controllers/organizationController.js";
import protect from '../middlewares/protect.js';
const orgRouter = express.Router();

orgRouter.post('/login', loginOrg);
orgRouter.post('/register', registerOrg);
orgRouter.get('/getOrgInfo', protect , getOrgInfo)
orgRouter.post('/createOppo', protect, createOppo)
orgRouter.get('/getAllOppo', getAllOppo)
export default orgRouter;