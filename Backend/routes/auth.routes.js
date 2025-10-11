import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';
import { askToAssistant, getCurrentUser, updateAssistant } from '../controllers/user.controller.js';

const authRouter = express.Router();


authRouter.get('/current',isAuth, getCurrentUser);
authRouter.post('/update',isAuth,upload.single("assistantImage"),updateAssistant);
authRouter.post("/asktoassistant",isAuth, askToAssistant )

export default authRouter;
