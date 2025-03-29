import amqplib from "amqplib";
import { transformImageService } from "../services/image.service";

export const startProducer = async (transformationParams, imageId) => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "image_processing";
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify({ transformationParams, imageId })),
        { persistent: true }
    );
    console.log("Message sent");
    await channel.close();
    await connection.close();
};

const startConsumer = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "image_processing";
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (message) => {
        try {
            const { transformationParams, imageId } = JSON.parse(
                message.content.toString()
            );
            await transformImageService(transformationParams, imageId);
            channel.ack(message);
            console.log("Message processed");
        } catch (e) {
            console.log(`Cannot process message: ${e}`)
            channel.nack(message);
        }
    });
};
