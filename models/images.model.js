import mongoose from 'mongoose';

const MetaDataSchema = new mongoose.Schema(
    {
        format: String,
        size : String,
        width: String,
        height: String,
    }
)

const ImageSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        metadata: {
            type: MetaDataSchema,
            required: false
        },
        url:{
            type: String,
            required: true
        }

    }
)


const ImageModel = mongoose.model("Images", ImageSchema);

export default ImageModel
