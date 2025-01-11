import AWS from "aws-sdk"
import config from "../config.js"

const awsConfig = config.AWS


const uploadToS3 = async(file, bucketName) =>{
    try {
        const aws_S3 = new AWS.S3({
            credentials: {
                accessKeyId: awsConfig.accessKeyId,
                secretAccessKey: awsConfig.secretKeyId
            }
        })
    
        const uploadedFileName = `image_${(Date.now()).toString()}.${file.mimetype.split("/")[1]}`
        const params = {
            Bucket: bucketName,
            Key: uploadedFileName,
            Body: file.data
        }
        // returrn a promise 
        return new Promise((resolve, reject)=>{
            aws_S3.upload(params, {}, (err, data)=>{
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

export default uploadToS3