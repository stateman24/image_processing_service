import config from "../config.js";
import uploadToS3 from "../utils/uploadImage.utils.js";



const uploadImage = async(req, res) =>{
    try {
        if(req.files.images.name){
            const uploadResult = await uploadToS3(req.files.images, config.AWS.bucketName);
            return res.status(201).json({"body": uploadResult});
        }
    } catch (error) {
        return res.status(500).json({
            "message": error,
        })
    }
};


export default uploadImage