import express from 'express';
import { signUp, login, Logout } from '../controllers/auth.controllers.js';


const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.get('/logout', Logout);

export default userRouter;
