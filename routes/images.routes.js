import express from "express"
import uploadImage from "../controller/image.controller.js"    

const image_router = express.Router();

image_router.post("/", uploadImage);

export default image_router;

