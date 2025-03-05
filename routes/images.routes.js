import express from "express"
import { uploadImage, downloadImage, transformImage, getImage, getImages } from "../controller/image.controller.js"
import { authmiddleware } from "../middlewares/auth.middleware.js";

const image_router = express.Router();

image_router.post("/", [authmiddleware], uploadImage);
image_router.get("/:id/download", downloadImage);
image_router.post("/:id/transform", transformImage);
image_router.get("/:imageId", [authmiddleware],  getImage);
image_router.get("/", [authmiddleware], getImages)

export default image_router;


