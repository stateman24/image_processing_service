import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { User } from "../models/user.model";
import createHttpError from "http-errors";
import config from "../config.js";

const authmiddleware = async (req, res, next) => {
  try {
    const Authorization = req.headers.authorization;
    if (Authorization) {
      const secretKey = config.JWT_SECRET;
      const verificaitionToken = verify(Authorization, secretKey);
      const authUserId = verificaitionToken._id;
      const authUser = await User.findById(authUserId);
      if (!authUser) {
        throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
      }
      req.user = authUser;
      next()
    }
  } catch (error) {
    next(error);
  }
};
