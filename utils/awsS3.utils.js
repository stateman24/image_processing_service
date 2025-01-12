import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import config from "../config.js"
import ImageModel from "../models/images.model.js"

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


export const getImageFromS3 = async(fileName,bucketName) =>{
    const params = {
        Bucket: bucketName,
        Key: uploadedFileName,
    }
    const getCommand = new GetObjectCommand(params);
    return new Promise((resolve, reject)=>{
        aws_S3.send(putCommand, (err, data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
}

export default uploadToS3