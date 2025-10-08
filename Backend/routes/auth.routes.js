import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { getCurrentUser } from '../controllers/user.controller.js';

const authRouter = express.Router();


authRouter.get('/current',isAuth, getCurrentUser);

export default authRouter;
