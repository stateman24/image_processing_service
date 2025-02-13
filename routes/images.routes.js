import express from "express"
import {uploadImage, downloadImage, transformImage, getImage, getImages } from "../controller/image.controller.js"    

const image_router = express.Router();

image_router.post("/", uploadImage);
image_router.get("/:id/download", downloadImage);
image_router.post("/:id/transform", transformImage);
image_router.get("/:id", getImage);
image_router.get("/", getImages)

export default image_router;


