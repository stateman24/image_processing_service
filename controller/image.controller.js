import config from "../config.js";
import axios from "axios"
import { uploadToS3, getImageFromS3 } from "../utils/awsS3.utils.js";
import ImageModel from "../models/images.model.js";
import fs from "fs"
import path from "path"


//TODO Need to get an image response using aws_presigner module (try)

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
        const __dirname = path.resolve();
        const localFilePath = path.join(__dirname, "image.jpeg");
        // Find the image in the database
        const image = await ImageModel.findById(id)
        if(!image){
            return res.status(404).json({"message": "Image not found"})
        }
        const imageUrl = await getImageFromS3(image.imageName, config.AWS.bucketName);
        // get Image from the Url
        const imageFileResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // images file response from the url
        const contentType = imageFileResponse.headers["content-type"];
        const fileName = image.imageName; // get Image file name from DB
        // set the response headers
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
        // send data
        return res.status(200).send(Buffer.from(imageFileResponse.data, "binary"));
    } catch (err){
        return res.status(500).json({"message": `${err}`})
    }
}

export default uploadImage