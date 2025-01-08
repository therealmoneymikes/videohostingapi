import { createClient } from "redis";
import Redis from "ioredis";

//create Redis Client
const redisClient = createClient();
/**
 * @description We will be using our redis client throughout are application
 *              to handle different areas of activity.
 *
 */

class RedisClient {
  private static instance: Redis;

  //Singleton Pattern just like prisma client to ensure we only
  //Have one instance at a time
  public static getClient(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: process.env.REDIS_HOST_URL || "127.0.0.0",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      });

      //Adding an event listener for the Redis Client instance to
      // signal that the connection is active
      RedisClient.instance.on("connect", () => {
        console.log("Connected to Redis");
      });

      //Error handlign for connection error
      RedisClient.instance.on("error", (err) => {
        console.error("Redis Error: ", err);
      });
    }
    return RedisClient.instance;
  }

  //time-to-live and expiry time for sessions
  public static async set(
    key: string,
    value: string,
    ttlInSeconds: number = 3600 //Defauly is 1hr
  ): Promise<void> {
    const client = RedisClient.getClient();
    await client.set(key, value, "EX", ttlInSeconds);
  }

  //Get Redis Session
  public static async get(key: string): Promise<string | null> {
    const client = RedisClient.getClient();
    return await client.get(key);
  }

  //Delete Redis session
  public static async del(key: string): Promise<number> {
    const client = RedisClient.getClient();
    return await client.del(key);
  }
}

export default RedisClient;
