import { Router } from "express";
import { loginIn, signUp } from "../controller/auth.controller.js";

export const auth_router = Router();

auth_router.post("/register", signUp);
auth_router.post("/login", loginIn);
