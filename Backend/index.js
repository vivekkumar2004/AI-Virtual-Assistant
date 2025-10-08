import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'



const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
const port = process.env.PORT || 5000 
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", userRouter)
app.use("/api/user", authRouter)



app.listen(port,()=>
{
    connectDb();
    console.log(`Server is started`);
    
})