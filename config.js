const config = {
    PORT: process.env.PORT,
    AWS:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretKeyId: process.env.AWS_SECRET_KEY_ID,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        awsRegion: process.env.AWS_REGION,
        awsConfigFile: process.env.AWS_SDK_LOAD_CONFIG
    },
    MONGO_DB_URI: `mongodb+srv://ajibewadannyboi:${process.env.DB_PASSWORD}@danielcluster.fd5sg.mongodb.net/ip_servicedb?retryWrites=true&w=majority&appName=danielcluster`
    
}

export default config



