import mongoose from "mongoose";
import RedisClient from "../Redis/client";
import videomodel, { IVideo } from "../models/videomodel";
import { processVideos } from "../utils/hlsprocessor";
import { describe } from "node:test";

export class VideoService {
  static async uploadVideo(videoData: IVideo) {
    const videoDir = "./videos"; // Directory with your original videos
    const outputDir = "./hls_output"; // Output directory for HLS files
    try {
      await processVideos(videoDir, outputDir, 2);
    } catch (error) {
      throw new Error(`Failed to process video: ${error.message}`);
    }

    const videoDataObject = {
      title: videoData.title,
      url: videoData.url,
      hlsPath: outputDir,
      description: videoData.description,
    };
    const video = new videomodel(videoDataObject);
    await video.save();
  }

  //Retrieve as List
  static async getAllVideos() {
    return await videomodel.find(); //Return all videos
  }

  //Retrieve a single video by the ID
  static async getVideoByIdentifier(id: string) {
    const videoCacheKey = `video:${id}`; //Redis Cache
    try {
      const cachedVideo = await RedisClient.get(videoCacheKey);

      if (cachedVideo) {
        return JSON.parse(cachedVideo);
      }

      const video = await videomodel.findById(id);
      if (!video) {
        throw new Error(`User with ID: ${id} does not exist`);
      }

      await RedisClient.set(videoCacheKey, JSON.stringify(video)) //Default TTL is 1 Hour
      return video;
    } catch (error) {
      console.error("Error retreiving video: ", error);
      throw new Error("Unable to retrieve video at this time");
    }
  }
}
