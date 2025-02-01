import express from "express"
import {uploadImage, getImage, transformImage} from "../controller/image.controller.js"    

const image_router = express.Router();

image_router.post("/", uploadImage);
image_router.get("/:id", getImage);
image_router.post("/:id/transform", transformImage);

export default image_router;


