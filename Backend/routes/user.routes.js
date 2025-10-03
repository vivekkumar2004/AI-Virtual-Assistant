import express from 'express';
import { login, Logout, signUp } from '../controllers/auth.controllers.js';


const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('login', login);
userRouter.get('/logout', Logout);

export default userRouter;
