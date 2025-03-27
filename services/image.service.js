import config from "../config.js";
import axios from "axios";
import {
    uploadToS3,
    getImageFromS3,
    sendImageToS3,
} from "../utils/awsS3.utils.js";
import ImageModel from "../models/images.model.js";
import {
    imageTransformer,
    getImageMetadata,
    getImageNameFromId,
    fetchImage,
} from "../utils/image.utils.js";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { redisClient } from "../utils/redisUtils.js";

export const uploadImageService = async (imageFile, userId) => {
    if (imageFile) {
        // if number of files is more then 1 upload one by one(multiple file upload)
        if (imageFile > 0) {
            const images = [];
            for (let i in imageFile) {
                const metadata = await getImageMetadata(imageFile[i].data);
                await uploadToS3(imageFile[i], config.AWS.bucketName);
                const url = await getImageFromS3(
                    imageFile[i].name,
                    config.AWS.bucketName,
                    18000
                );
                const image = await ImageModel.create({
                    name: imageFile.name,
                    metadata: metadata,
                    url: url,
                    user: userId,
                });
                images.push(image);
            }
            return images;
        }
        // single file upload
        const metadata = await getImageMetadata(imageFile.data);
        await uploadToS3(imageFile, config.AWS.bucketName);
        const url = await getImageFromS3(
            imageFile.name,
            config.AWS.bucketName,
            18000
        );
        const image = await ImageModel.create({
            name: imageFile.name,
            metadata: metadata,
            url: url,
            user: userId,
        });
        return image;
    } else {
        throw createHttpError(
            StatusCodes.BAD_REQUEST,
            "Image file not provided"
        );
    }
};

// get All User Images Services
export const getImagesService = async (userId) => {
    const images = await ImageModel.find({ user: userId });
    if (!images) {
        throw createHttpError(StatusCodes.NOT_ACCEPTABLE, "Images not found");
    }
    return images;
};

// get a single image metadata Service
export const getImageService = async (imageId) => {
    if (!imageId) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Provide IMAGEID");
    }
    // get image form  cache
    const cacheImage = await redisClient.get(imageId);
    if (cacheImage) {
        return JSON.parse(cacheImage);
    }
    const image = await ImageModel.findById(imageId);
    if (!image) {
        throw createHttpError(
            StatusCodes.NOT_FOUND,
            "Image MetaData not found"
        );
    }
    await redisClient.set(imageId, JSON.stringify(image), "EX", 3600)
    return image;
};

// download an image from S3 bucket
export const downloadImageService = async (imageId) => {
    const imageName = await getImageNameFromId(imageId);
    const imageUrl = await getImageFromS3(
        imageName,
        config.AWS.bucketName,
        3600
    );
    // get Image using the Url
    const imageFileResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
    }); // images file response from the url
    const contentType = imageFileResponse.headers["content-type"];
    const fileName = imageName; // get Image file name from DB
    return {
        fileResponse: imageFileResponse,
        filename: fileName,
    };
};

export const transformImageService = async (transformationParams, imageId) => {
    // get transfprmed image from cache
    const cacheImageTransformed = await redisClient.get(imageId);
    if (cacheImageTransformed) {
        return JSON.parse(cacheImageTransformed);
    }

    // cache miss
    const imageName = await getImageNameFromId(imageId);
    const imageUrl = await getImageFromS3(imageName, config.AWS.bucketName);
    const imageFileBuffer = await fetchImage(imageUrl);
    const transformedImageBuffer = await imageTransformer(
        imageFileBuffer,
        transformationParams,
        imageId
    );
    if (!transformedImageBuffer) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Image not Transfomed");
    }
    // upload image back to the cloud
    const uploadResult = await sendImageToS3(
        transformedImageBuffer,
        config.AWS.bucketName,
        imageName
    );
    if (!uploadResult) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Something Went Wrong");
    }
    await redisClient.set(imageId, JSON.stringify(uploadResult), "EX", 3600)
    return uploadResult
};
