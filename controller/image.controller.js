import config from "../config";
import uploadToS3 from "../utils/uploadImage.utils";

const uploadImage = async(req, res) =>{
    try {
        const uploadResult = await uploadToS3(req.file.image, config.AWS.bucketName);
        return res.status(201).json({
            message: "Image uploaded successfully",
        })

    } catch (error) {
        return res.status(500).json({
            "message": error,
        })
    }
};