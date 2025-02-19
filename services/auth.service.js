import { User } from "../models/user.model.js";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import config from "../config.js";
import jwt from "jsonwebtoken";

export const signUpService = async (signUpData) => {
  if (!signUpData) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "User input required");
  }
  const { password, passwordRepeat, email } = signUpData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Email already exists");
  }

  if (password !== passwordRepeat) {
    throw createHttpError(
      StatusCodes.BAD_REQUEST,
      "Repeat Password does not match",
    );
  }

  const user = await User.create(signUpData);

  return user;
};

export const loginService = async (loginData) => {
  if (!loginData) {
    throw createHttpError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "User Login details not provided",
    );
  }

  const user = await User.findOne({ email: loginData.email });
  if (!user) {
    throw createHttpError(StatusCodes.NOT_FOUND, "User does not exists");
  }
  const isMatch = await bcrypt.compare(loginData.password, user.password);
  if (!isMatch) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Incorrect Password");
  }
  const expiresIn = 3600;
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn });
  return { user, token };
};
