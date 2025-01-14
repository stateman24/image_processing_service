import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import config from "../config.js"
import ImageModel from "../models/images.model.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const awsConfig = config.AWS

const aws_S3 = new S3Client({
    region: awsConfig.region,
    credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretKeyId
    }
})

export const uploadToS3 = async(file, bucketName) =>{
    try {
        const uploadedFileName = `image_${(Date.now()).toString()}.${file.mimetype.split("/")[1]}`;
        // save image metadata to the database
        const imageNametoDB = ImageModel.create({imageName: uploadedFileName});
        const params = {
            Bucket: bucketName,
            Key: uploadedFileName,
            Body: file.data,
            ContentType: file.mimetype
        }
        const putCommand = new PutObjectCommand(params)
        // returrn a promise 
        return new Promise((resolve, reject)=>{
            aws_S3.send(putCommand, (err, data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    } catch (error) {
        return error
    }
}


export const getImageFromS3 = async(fileName, bucketName) =>{
    const params = {
        Bucket: bucketName,
        Key: fileName,
    }
    try {
        const getCommand = new GetObjectCommand(params);
        const signedUrl =  await getSignedUrl(aws_S3, getCommand, { expiresIn: 3600 });
        return signedUrl
    }catch(err){
        console.error(`${err}`)
    }
    
}

export default uploadToS3