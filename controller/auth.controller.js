import { loginService, signUpService } from "../services/auth.service.js";
import { StatusCodes } from "http-status-codes";

export const signUp = async (req, res, next) => {
  try {
    const user = await signUpService(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ data: user, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginIn = async (req, res, next) => {
  try {
    const { user, token } = await loginService(req.body);
    res
      .status(StatusCodes.OK)
      .json({ data: { user, token }, message: "User Login Sucessfull" });
  } catch (error) {
    next(error);
  }
};
