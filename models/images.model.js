import mongoose from 'mongoose';


const ImageSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        metadata: {
            type: Map,
            of: String,
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
