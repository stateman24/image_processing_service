import sharp from "sharp"
import axios from "axios";
import ImageModel from "../models/images.model.js";
import createHttpError from "http-errors";



// fectch image from url
export const fetchImage = async (url) => {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" })
        return response.data;
    } catch (error) {
        console.error(`${error}`)
    }
}


export const getImageNameFromId = async (id) => {
    // Find the image in the database
    const image = await ImageModel.findById(id)
    if (!image) {
        throw createHttpError(StatusCodes.NOT_FOUND, "Image not Found")
    }
    return image.name;
}

export const getImageMetadata = async (imageFile) => {
    try {
        const image = sharp(imageFile)
        const imageMetadata = await image.metadata();
        return {
            format: imageMetadata.format,
            size: imageMetadata.size,
            height: imageMetadata.height,
            width: imageMetadata.width,
        }

    } catch (err) {
        return Promise.reject(err)
    }

}


export const imageTransformer = async (imageBuffer, transformation, imageId) => {
    const image = sharp(imageBuffer)
    const transformParamKeys = Object.keys(transformation);
    // loop through all the transformation key
    for (let key of transformParamKeys) {
        if (key === "crop") {
            //console.log(key)
            image.extract(transformation.crop);
        }
        if (key === "rotate") {
            //console.log(key)
            image.rotate(transformation.rotate);
        }
        if (key === "resize") {
            //console.log(key)
            image.resize(transformation.resize);
        }
    }
    // update Image metadata in DB 
    const imageMetadata = await image.metadata();
    const metadata = {
        format: imageMetadata.format,
        size: imageMetadata.size,
        height: imageMetadata.height,
        width: imageMetadata.width,
    }
    await ImageModel.findByIdAndUpdate(imageId, {metadata: metadata})
    return image.toBuffer();
}
export default imageTransformer
