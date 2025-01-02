import express from 'express';
import * as userController from '../controller/user.controller.js';


export const router = express.Router();

router.post("register/", userController.register);
router.get("/", userController.helloWorld);