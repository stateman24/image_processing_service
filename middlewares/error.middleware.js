import { StatusCodes } from "http-status-codes";
export const errorMiddleware = async (error, req, res, next) => {
  try {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something Went Wrong";
    res.status(status).json(message);
  } catch (error) {
    next(error);
  }
};
