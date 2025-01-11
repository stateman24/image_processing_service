import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
    {
        imageUrl:{
            type: String,
            required: true
        }
    }
)


const Images = mongoose.model("Images", ImageSchema);

export default Images
