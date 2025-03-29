import { downloadImageService, getImageService, getImagesService, transformImageService, uploadImageService } from "../services/image.service.js";
import { StatusCodes } from "http-status-codes";
import { startProducer } from "../utils/rabbitmq.utils.js";


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

// getImages Controller
export const getImages = async (req, res, next) => {
    try {
        const user = req.user; // get the authenticated user
        const images = await getImagesService(user._id);
        res.status(StatusCodes.OK).json({ data: images });
    } catch (error) {
        next(error)
    }
};

// get a single image by Id
export const getImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const image = await getImageService(imageId);
        res.status(StatusCodes.OK).json({ data: image });
    } catch (error) {
        next(error)
    }
};

// downloadImage an Image form the cloud
export const downloadImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const { fileResponse, filename } = await downloadImageService(imageId);
        res.setHeader("Content-Type", fileResponse.headers["content-type"]);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );
        // send image binary data as a response
        return res
            .status(200)
            .send(Buffer.from(fileResponse.data, "binary"));
    } catch (error) {
        next(error)
    }
};

// Transform Image based on transformation parameters
export const transformImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const transformationParams = req.body.transformations;
        await startProducer(transformationParams, imageId);
        return res.status(StatusCodes.OK).json({ message: "Image Transformed" });
    } catch (error) {
        next(error)
    }
};


export default uploadImage;
