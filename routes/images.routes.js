import express from "express"
import {uploadImage, downloadImage, transformImage } from "../controller/image.controller.js"    

const image_router = express.Router();

image_router.post("/", uploadImage);
image_router.get("/:id", downloadImage);
image_router.post("/:id/transform", transformImage);

export default image_router;


