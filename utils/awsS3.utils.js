import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import config from "../config.js"
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
        const params = {
            Bucket: bucketName,
            Key: file.name,
            Body: file.data,
            ContentType: file.mimetype
        }
        const putCommand = new PutObjectCommand(params)
        await aws_S3.send(putCommand, (err, data)=>{
            if(err){
               return Promise.reject(err);
            }
            return Promise.resolve(data);
        })
    } catch (error) {
        return error
    }
}


export const getImageFromS3 = async(fileName, bucketName, expireTime) =>{
    const params = {
        Bucket: bucketName,
        Key: fileName,
    }
    try {
        const getCommand = new GetObjectCommand(params);
        return await getSignedUrl(aws_S3, getCommand, {expiresIn: expireTime})
    }catch(err){
        console.error(`${err}`)
    }
    
}


export const sendImageToS3 = async(file, bucketName, uploadFileName) =>{
    try {
        const parallelUploads3 = new Upload({
            client: new S3Client({
                region: awsConfig.region,
                credentials: {
                    accessKeyId: awsConfig.accessKeyId,
                    secretAccessKey: awsConfig.secretKeyId
                }
            }),
            params: {
                Bucket: bucketName,
                Key: uploadFileName,
                Body: file,
                ContentType: "image/jpeg"
            },
        });
        parallelUploads3.on("httpUploadProgress", (progress)=>{
            console.log(progress);
        })
        await parallelUploads3.done()
    } catch (error) {
        return error
    }
}

export default uploadToS3