import config from "../config.js";
import axios from "axios"
import {uploadToS3, getImageFromS3, sendImageToS3} from "../utils/awsS3.utils.js";
import ImageModel from "../models/images.model.js";
import imageTransformer from "../utils/image.utils.js";


// a helper function that uses image id to return an image url from AWS
const getImageNameFromId = async(id) =>{
    try {
        // Find the image in the database
        const image = await ImageModel.findById(id)
        if(!image){
            return null
        }
        return image.imageName
    } catch (error) {
        console.error(`${error}`)
    }
}

const fetchImage = async(url) => {
    try {
        const response = await axios.get(url, {responseType: "arraybuffer"})
        return response.data;
    } catch (error) {
        console.error(`${error}`)
    }
}

export const uploadImage = async(req, res) =>{
    try {
        if(req.files.images.name){
            const uploadResult = await uploadToS3(req.files.images, config.AWS.bucketName);
            return res.status(201).json({"body": uploadResult});
        }
    } catch (error) {
        return res.status(500).json({
            "message": `${error}`,
        })
    }
};


export const getImage = async(req, res) =>{
   try{ 
        const { id } = req.params;
        const imageName = await getImageNameFromId(id);
        const imageUrl = await getImageFromS3(imageName, config.AWS.bucketName);
        // get Image from the Url
        const imageFileResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // images file response from the url
        const contentType = imageFileResponse.headers["content-type"];
        const fileName = imageName; // get Image file name from DB
        // set the response headers
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
        // send image binary data as a response
        return res.status(200).send(Buffer.from(imageFileResponse.data, "binary"));
    } catch (err){
        return res.status(500).json({"message": `${err}`})
    }
}

export const transformImage = async(req, res) => {
    try {
        const { id } = req.params;
        const transformationParams = req.body
        const imageName = await getImageNameFromId(id);
        const imageUrl = await getImageFromS3(imageName, config.AWS.bucketName);
        const imageFileBuffer = await fetchImage(imageUrl);
        console.log(imageFileBuffer);
        const transformedImageBuffer = await imageTransformer(imageFileBuffer, transformationParams);
        console.log(transformedImageBuffer);
        // upload image back to the cloud
        const uploadResult = await sendImageToS3(transformedImageBuffer, config.AWS.bucketName, imageName);
        return res.status(200).json({uploadResult})
    } catch (error) {
        return res.status(500).json({"message": `${error}`})
    }
}

// TODO: Test the transform image endpoint


export default uploadImage