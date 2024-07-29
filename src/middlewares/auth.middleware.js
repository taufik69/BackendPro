import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { Usermodel } from "../model/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorize access");
    }

    /**
     * todo : check  the token in valid i mean is the token in real
     */

    const isValidToken = jwt.verify(token, process.env.ACCESS_TOKEN_SCCRECT);
    const user = await Usermodel.findById(isValidToken._id).select(
      "-password -RrefreshToken"
    );
    if (!user) {
      throw new ApiError(401, "InValid AcessToken");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

export { verifyJwt };
