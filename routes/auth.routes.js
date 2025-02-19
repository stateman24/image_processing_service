import { Router } from "express";
import { signUp } from "../controller/auth.controller.js";

export const auth_router = Router();


auth_router.post("/register", signUp);
