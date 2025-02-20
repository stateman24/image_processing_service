import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

export const errorMiddleware = async (error, req, res, next) => {
  try {
    if (createHttpError.isHttpError(error) && createHttpError.isHttpError) {
      console.log("It is an http error")
      const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      const message = error.message || "Something Went Wrong";
      res.status(status).json(message);
    }
    console.log("it is not an http error moving on to the next middleware")
    next();
  } catch (error) {
    next(error);
  }
};
