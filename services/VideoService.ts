import mongoose from "mongoose";
import RedisClient from "../Redis/client";
import videomodel from "../models/videomodel";










export class VideoService {

   static async getVideoByIdentifier(id: string){
   try {
     const videoCacheKey = `video:${id}`;
     const cachedVideo = await RedisClient.get(videoCacheKey)

     if(cachedVideo){
        return JSON.parse(cachedVideo)
     }

     const video = await videomodel.findById(id);
     if(!video){
        throw new Error(`User with ID: ${id} does not exist`)
     }
     return video;
   } catch (error) {
        console.error("Error retreiving video: ", error)
        throw new Error("Unable to retrieve video at this time")
   }
   }
}