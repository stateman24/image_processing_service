import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
    {
        imageName:{
            type: String,
            required: true
        }
    }
)


const ImageModel = mongoose.model("Images", ImageSchema);

export default ImageModel
