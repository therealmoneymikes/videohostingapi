import express from "express";
import morgan from "morgan";
import { requestRateLimiter } from "./middleware/requestratelimiter";
import { connectToDb } from "./db/db";
import RedisClient from "./Redis/client";
import dotenv from "dotenv"
import {userRoutes, videoRoutes, paymentRoutes, }from "./routes/index"

import cors from "cors"
import config from "../videohostingapi/config/config.json"
import { routes } from "./config/urlconfig";
const app = express();

//Envs
dotenv.config();

//STDs
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Middleware
app.use(morgan(`${process.env.NODE_ENV === "development" ? "dev" : "production"}`));//morgan

//Static files
app.use("/hls", express.static("./hls_output"))




//Database
connectToDb(process.env.MONGO_URI!);
//Redis

if (process.env.REDIS_ENABLED === "true"){
    (async () => {
       try{ 
        await RedisClient.getClient()
        } catch (err){
            if (err instanceof Error)
                console.error("Redis Error: ", err.message)
        }
    } )
}


//Routes
app.use(routes.USERS, userRoutes)
app.use(routes.VIDEOS, videoRoutes)

//Stripe Routes
app.use(routes.PAYMENTS, paymentRoutes)

    console.log(routes.USERS)


//Server
const PORT = Number(process.env.PORT) ?? 3000
app.listen(PORT, "localhost", 10, () => {
    console.group(`Server is running on port ${PORT}`)
})