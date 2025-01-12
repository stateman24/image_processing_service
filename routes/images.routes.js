import express from "express"
import {uploadImage, getImage} from "../controller/image.controller.js"    

const image_router = express.Router();

image_router.post("/", uploadImage);
image_router.get("/:id", getImage);

export default image_router;


