import { StatusCodes } from "http-status-codes";
import pkg from "jsonwebtoken";
import { User } from "../models/user.model.js";
import createHttpError from "http-errors";
import config from "../config.js";

const { verify } = pkg;

export const authmiddleware = async (req, res, next) => {
  try {
    const Authorization = req.headers.authorization.split("Bearer ")[1];
    if (Authorization) {
      const secretKey = config.JWT_SECRET;
      const verificationToken = verify(Authorization, secretKey);
      const authUserId = verificationToken._id;
      const authUser = await User.findById(authUserId);
      if (!authUser) {
        throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
      }
      req.user = authUser;
      next();
    } else {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "Provide Authorization Token",
      );
    }
  } catch (error) {
    next(error);
  }
};
