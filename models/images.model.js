import mongoose, { SchemaTypes } from "mongoose";

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  metadata: {
    type: Map,
    of: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const ImageModel = mongoose.model("Images", ImageSchema);

export default ImageModel;
