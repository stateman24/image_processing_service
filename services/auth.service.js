import { User } from "../models/user.model.js";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

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
