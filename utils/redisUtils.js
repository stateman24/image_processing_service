import { createClient } from "redis";
import config from "../config.js";

export const redisClient = createClient({
    url: config.REDIS_URL
})


export const connectToRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis client connected successfully");
    } catch (error) {
        console.log("Error connecting to Redis client", error);
    }
}
