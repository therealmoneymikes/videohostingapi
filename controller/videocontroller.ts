import { VideoService } from "../services/VideoService";
import { Request, Response } from "express";

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await VideoService.getVideoByIdentifier(id);
    if (!video) {
      res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await VideoService.getAllVideos();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const videos = await VideoService.uploadVideo(req.body);
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
