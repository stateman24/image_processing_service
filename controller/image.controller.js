import config from "../config.js";
import uploadToS3 from "../utils/uploadImage.utils.js";
import ImageModel from "../models/images.model.js"

const uploadImage = async(req, res) =>{
    try {
        if(req.files.images.name){
            const uploadResult = await uploadToS3(req.files.images, config.AWS.bucketName);
            const imageName = {"imageName": uploadResult.Key}
            const image = ImageModel.create(imageName);
            return res.status(201).json({"body": uploadResult, image});
        }
    } catch (error) {
        return res.status(500).json({
            "message": `${error}`,
        })
    }
};


export default uploadImage