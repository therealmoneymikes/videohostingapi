import express from "express";
import morgan from "morgan";
import { requestRateLimiter } from "./middleware/requestratelimiter";
import { connectToDb } from "./db/db";
import RedisClient from "./Redis/client";
import dotenv from "dotenv"
import {userRoutes, videoRoutes }from "./routes/index"

import cors from "cors"
const app = express();

//Envs
dotenv.config();

//STDs
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Middleware
app.use(morgan(`${process.env.NODE_ENV === "development" ? "dev" : "production"}`));//morgan
app.use(express.json());//json parsing 
app.use(express.urlencoded({ extended: true }));

//Static files
app.use("/hls", express.static("./hls_output"))




//Database
connectToDb(process.env.MONGO_URI!);
//Redis
RedisClient.getClient().connect();

//Routes
app.use("/api/v1", userRoutes)
app.use("/api/v1/videos", videoRoutes)


//Server
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.group(`Server is running on port ${PORT}`)
})