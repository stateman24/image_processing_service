import express from "express"
import { uploadImage, downloadImage, transformImage, getImage, getImages, enhanceImageController } from "../controller/image.controller.js"
import { authmiddleware } from "../middlewares/auth.middleware.js";

const image_router = express.Router();

image_router.post("/", [authmiddleware], uploadImage);
image_router.get("/:imageId/download",[authmiddleware], downloadImage);
image_router.post("/:imageId/transform", [authmiddleware], transformImage);
image_router.get("/:imageId", [authmiddleware],  getImage);
image_router.get("/enhance", [authmiddleware], enhanceImageController)
image_router.get("/", [authmiddleware], getImages)

export default image_router;


