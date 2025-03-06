import UserService from "../services/UserService";
import express from "express";
import {
  getVideoById,
  getAllVideos,
  uploadVideo,
} from "../db/videocontroller";
import { validate } from "../middleware/userschemamiddleware";
import { videoValidationSchema } from "../validators/videovalidation";

const router = express.Router();

router.get("/", getAllVideos); //Get all videos
router.get("/:id", getVideoById); //Get videos by ID
router.post("/uploadvideos", validate(videoValidationSchema), uploadVideo);

export default router;
