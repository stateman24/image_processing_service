import config from "../config.js";
import { uploadToS3, getImageFromS3 } from "../utils/awsS3.utils.js";
import ImageModel from "../models/images.model.js";
import path from "path";

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
        const options = {
            root: path.join(__dirname)
        }
        // Find the image in the database
        const image = await ImageModel.findById(id)
        if(!image){
            return res.status(404).json({"message": "Image not found"})
        }
        const imageFile = await getImageFromS3(image.imageName);
        // Set the appropriate headers for the file response
        res.setHeader('Content-Type', imageFile.ContentType);
        res.setHeader('Content-Disposition', `attachment; filename=${image.imageName}`);
        return res.status(200).send(imageFile.Body)
    } catch (err){
        return res.status(500).json({"message": `${err}`})
    }
}

export default uploadImage