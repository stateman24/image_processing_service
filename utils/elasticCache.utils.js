import { createClient } from "redis";

// export const client = createClient({
//     host: "clustercfg.image-processing-cluster.ht6zjz.eun1.cache.amazonaws.com",
//     port: 6379,
// });

// client.on("error", (error) => {
//     console.error(`Redis error: ${error}`);
// });

// client.on("connect", () => {
//     console.info("Connected to ElastiCache Redis");
// });

export const connectToRedis = () => {
    const client = createClient({
        socket: {
            host: "clustercfg.image-processing-cache.ht6zjz.eun1.cache.amazonaws.com", // Replace with your Valkey endpoint
            port: 6379, // Default Redis/Valkey port
            tls: {}, // Enable TLS if required
        },
    });

    client
        .connect()
        .then(() => {
            console.log("Conneted to Redis Server");
        })
        .catch((error) => {
            console.log(`Failed to Connect to Redis Server: ${error}`);
            console.log(error);
        });
};
