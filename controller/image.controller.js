import config from "../config.js";
import axios from "axios"
import {uploadToS3, getImageFromS3, sendImageToS3} from "../utils/awsS3.utils.js";
import ImageModel from "../models/images.model.js";
import { imageTransformer, getImageMetadata, getImageNameFromId, fetchImage } from "../utils/image.utils.js";


export const uploadImage = async(req, res) =>{
    try {
       console.log(req.files)
        if(req.files.images){
            // if number of files is more then 1 upload one by one(multiple file upload)
            if(req.files.images.length > 0){
                const images = []
                for(let i in req.files.images){
                    const metadata =  await getImageMetadata(req.files.images[i].data);
                    await uploadToS3(req.files.images[i], config.AWS.bucketName);
                    const url = await getImageFromS3(req.files.images[i].name, config.AWS.bucketName, 18000);
                    const image = await ImageModel.create({
                        name: req.files.images[i].name,
                        metadata: metadata,
                        url: url
                    });
                    images.push(image);
                }
                return res.status(201).json(images);
            }
            // single file upload
            const metadata =  await getImageMetadata(req.files.images.data);
            await uploadToS3(req.files.images, config.AWS.bucketName);
            const url = await getImageFromS3(req.files.images.name, config.AWS.bucketName, 18000);
            const image = await ImageModel.create({
                name: req.files.images.name,
                metadata: metadata,
                url: url
            });
            return res.status(201).json(image);
        }

    } catch (error) {
        return res.status(500).json({
            "message": `${error}`,
        })
    }
};


export const downloadImage = async(req, res) =>{
   try{ 
        const { id } = req.params;
        const imageName = await getImageNameFromId(id);
        const imageUrl = await getImageFromS3(imageName, config.AWS.bucketName, 3600);
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
        const transformationParams = req.body.transformations
        const imageName = await getImageNameFromId(id);
        const imageUrl = await getImageFromS3(imageName, config.AWS.bucketName);
        const imageFileBuffer = await fetchImage(imageUrl);
        const transformedImageBuffer = await imageTransformer(imageFileBuffer, transformationParams);
        // upload image back to the cloud
        // const uploadResult = await sendImageToS3(transformedImageBuffer, config.AWS.bucketName, imageName);
        return res.status(200).json({"message": "Image Transformed"})
    } catch (error) {
        return res.status(500).json({"message": `${error}`})
    }
}

// TODO: make all controllers to only hand requests and send response
// TODO: Split the some controller functionalities to the services module e.g transform

export default uploadImage
