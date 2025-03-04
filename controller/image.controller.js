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
import { uploadImageService } from "../services/image.service.js";
import { StatusCodes } from "http-status-codes";

// upload image controller
export const uploadImage = async (req, res, next) => {
    try {
        if (req.files.images) {
            const imagesFilesToUpload = req.files.images;
            const image = await uploadImageService(
                imagesFilesToUpload,
                req.user._id
            );
            res.status(StatusCodes.CREATED).json({
                data: image,
                message: "Image(s) uploaded succefully",
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: req });
        }
    } catch (error) {
        next(error);
    }
};

// get Images controller
// TODO: Refactor to Image Services
export const getImages = async (req, res, next) => {
    try {
        const images = await ImageModel.find({});
        if (!images) {
            return res.status(404).json({ message: "No Image Entries" });
        }
        return res.status(200).json(images);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// get a single image by Id
// TODO: Refactore to Image Services
export const getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await ImageModel.findById(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        return res.status(200).json(image);
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

// downloadImage an Image form the cloud
// TODO: Refactor to Image Service
export const downloadImage = async (req, res) => {
    try {
        const { id } = req.params;
        const imageName = await getImageNameFromId(id);
        const imageUrl = await getImageFromS3(
            imageName,
            config.AWS.bucketName,
            3600
        );
        // get Image from the Url
        const imageFileResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
        }); // images file response from the url
        const contentType = imageFileResponse.headers["content-type"];
        const fileName = imageName; // get Image file name from DB
        // set the response headers
        res.setHeader("Content-Type", contentType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        // send image binary data as a response
        return res
            .status(200)
            .send(Buffer.from(imageFileResponse.data, "binary"));
    } catch (err) {
        return res.status(500).json({ message: `${err}` });
    }
};

// Transform Image based on transformation parameters
// TODO: Refactor to Image Service
export const transformImage = async (req, res) => {
    try {
        const { id } = req.params;
        const transformationParams = req.body.transformations;
        const imageName = await getImageNameFromId(id);
        const imageUrl = await getImageFromS3(imageName, config.AWS.bucketName);
        const imageFileBuffer = await fetchImage(imageUrl);
        const transformedImageBuffer = await imageTransformer(
            imageFileBuffer,
            transformationParams
        );
        // upload image back to the cloud
        const uploadResult = await sendImageToS3(
            transformedImageBuffer,
            config.AWS.bucketName,
            imageName
        );
        return res.status(200).json({ message: "Image Transformed" });
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

export default uploadImage;
