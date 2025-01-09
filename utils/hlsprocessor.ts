import { exec } from "child_process";
import fs from "fs";
import path from "path";

const conversionCommand = (
  _inputPath: string,
  _outputPath: string,
  encodingSpeed: string = "fast",
  keyframeInterval: string = "60",
  sceneChangeDetection: string = "0",
  videoOutputFormat: string = "hls",
  videoStreamSegmentTime: string = "10" //Note to self test 5, 7, 10 seconds
): string => {
  //Note toself list_size stays 0 playlist includes all segements
  return `ffmpeg -i ${_inputPath} -preset ${encodingSpeed} -g ${keyframeInterval} -sc_threshold ${sceneChangeDetection} -map 0 -f ${videoOutputFormat} 
-hls_time ${videoStreamSegmentTime} -hls_list_size 0 -hls_segment_filename "${_outputPath}/segment_%03d.ts" 
"${_outputPath}/playlist.m3u8"`;
};

const convertVideoToHLS = (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    //I've manually handle the resolve and reject for the ffmpeg conversion logic

    const command = conversionCommand(inputPath, outputPath);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        console.warn(`stderr: ${stderr}`);
      } else {
        resolve();
      }
    });
  });
};

export const processVideos = async (videoDir: string, outputDir: string) => {
  //Extensions
  const SUPPORTED_EXTENSIONS = /\.(mp4|avi|mkv)$/;
  //Note to self, course videos are mp4 or avi or mkv only for now
  const videos = fs
    .readdirSync(videoDir)
    .filter((file) => SUPPORTED_EXTENSIONS.test(file));

  const promises = videos.map(async (video) => {
    const inputPath = path.join(videoDir, video);
    const outputPath = path.join(outputDir, path.parse(video).name); //Files name without the extension

    //Make a New Dir
    fs.mkdirSync(outputPath, { recursive: true });

    try {
      console.log(`Processing video: ${video}`);
      await convertVideoToHLS(inputPath, outputPath);
      console.log(`${video} coverted to a HLS file succesffully!`);
    } catch (error) {
      console.error(`Failed to convert ${video}:`, error);
    }
  });

  await Promise.all(promises);
};




