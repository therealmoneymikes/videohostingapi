import { exec, spawn } from "child_process";
import { Worker as ThreadWorker, isMainThread, parentPort, workerData } from "worker_threads";
import fs from "fs";
import { maxHeaderSize } from "http";
import path from "path";

const conversionCommand = (
  _inputPath: string,
  _outputPath: string,
  encodingSpeed: string = "fast",
  keyframeInterval: string = "60",
  sceneChangeDetection: string = "0",
  videoOutputFormat: string = "hls",
  videoStreamSegmentTime: string = "10" //Note to self test 5, 7, 10 seconds
): string[] => {
  //Note toself list_size stays 0 playlist includes all segements
  return [
    "-i",
    _inputPath, //Specifies input video file for processing
    "-preset",
    encodingSpeed, //Default preset encoding speed is fast
    "-g",
    keyframeInterval, //Keyframe interval - Default is 60
    "-sc_threshold",
    sceneChangeDetection, //Keeps consistent segement size by disabled scene change detection
    "-map",
    "0", //Maps all streams (video/audio) to the output
    "-f",
    videoOutputFormat, //HLS format output type
    "-hls_time",
    videoStreamSegmentTime, //Default HLS segment is 10 seconds
    "-hls_list_size",
    "0", //Ensures that the playlist contains all the segments, not just thre recent ones
    "-hls_segment_filename",
    path.join(_outputPath, "segment_%03d.ts"), //generates segements e.g segment_001.ts, segment_002.ts
    path.join(_outputPath, "playlist.m3u8"),//The main HLS playlist files
  ];}

  //Coverts videos from coversion command to HLS
const convertVideoToHLS = (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    //I've manually handle the resolve and reject for the ffmpeg conversion logic


    const commandArgs = conversionCommand(inputPath, outputPath);
    const ffmpegSpawn = spawn("ffmpeg", commandArgs);

    //On STDout messages in the data event, this displays the data info as a string
    ffmpegSpawn.stdout.on("data", (data) => console.log(`[FFmpeg]: ${data.toString()}`));
    //On STDERR message in the error event, this displays the data info as 
    ffmpegSpawn.stderr.on("data", (data) => console.error(`[FFmpeg ERROR]: ${data.toString()}`));

    ffmpegSpawn.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ Successfully converted: ${inputPath}`);
        resolve();
      } else {
        reject(`❌ FFmpeg process exited with code ${code}`);
      }
    });
  });
};


//Update add maxThread amount to handle concurrency
const processWorkers = async (videoPath: string, outputPath: string) => {
  try {
    console.log(`Worker processing video data: ${videoPath}`)
    await convertVideoToHLS(videoPath, outputPath);
    console.log(`🎉 Finished processing: ${videoPath}`);
    parentPort?.postMessage({ success: true });
    console.log(``)
  } catch (error) {
       console.error(`⚠️ Worker error: ${error}`);
       parentPort?.postMessage({ success: false });
  }
}

//Ensures that processWorkers is running on the main thread 
//The main communcation chanmel between the main thread and the workers is parentPort
//via {success: true} or false for task completion
//via workerData
if (!isMainThread) {
  processWorkers(workerData.inputPath, workerData.outputPath);
}
export const processVideos = async (videoDir: string, outputDir: string, maxThreads: number) => {
  //Extensions
  const SUPPORTED_EXTENSIONS = /\.(mp4|avi|mkv)$/;
  //Note to self, course videos are mp4 or avi or mkv only for now
  const videos = fs
    .readdirSync(videoDir)
    .filter((file) => SUPPORTED_EXTENSIONS.test(file));

  const videoQueue = videos.map(async (video) => {
    const inputPath = path.join(videoDir, video);
    const outputPath = path.join(outputDir, path.parse(video).name); //Files name without the extension

    //Make a New Dir
    fs.mkdirSync(outputPath, { recursive: true });
    //return input and outpupt paths
    return {inputPath, outputPath}
  });

  //By FIFO -> First in the queue gets processed then shifted
  const activeWorkerThreads: Promise<void>[] = [];

  while (videoQueue.length > 0) {
    if(activeWorkerThreads.length < maxThreads) {
      const {inputPath, outputPath} = await videoQueue.shift()!;

      const workerPromise = new Promise<void>((resolve, reject) => {
        //Generate a new Work
        const worker = new ThreadWorker(__filename, {
          workerData: {inputPath, outputPath},
        });
      
        worker.on("message", (message) => {
          if(message && typeof message.success === "boolean"){
            if (message.success) {
              message.success ? resolve(): reject(`❌ Failed to process ${inputPath}`)

            } else {
              console.log(`Worked failed to process ${inputPath}: ${message.error}`)
            }
          }
      })
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if(code !== 0) reject(`Worker stopped with exit code ${code}`)
        })
      })
      //Push worker into the active worker threads array
      activeWorkerThreads.push(workerPromise);
      //Once workerPromise is complete we will remove it from the promises array
      workerPromise.finally(() => {
        activeWorkerThreads.splice(activeWorkerThreads.indexOf(workerPromise), 1)
      });
    }
    //Takes the promise array to generate a new promise that resolves as soon as one of the 
    //promises of the worker is resolved i,e [Promise 1, Promise 2, Promise 3] if 1 is resolved, the value
    //return from Promise.race would be the result of Promise 1
    await Promise.race(activeWorkerThreads)
  }

  await Promise.all(activeWorkerThreads);
};




