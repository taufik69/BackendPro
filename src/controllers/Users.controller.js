import { asyncHandler } from "../utils/AsyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Usermodel } from "../model/user.model.js";
const UserRegistration = asyncHandler(async (req, res) => {
  //get users validation from frontend
  //validation
  // check if users is already exist -- username ,email
  //check avatar and image
  // upload cloudinary  avatar and iamge
  // create user  object
  // remove password and refresh token field from response
  // check for users creation
  // return res
  const { fullName, email, username, password } = req.body;

  if (!fullName) {
    return res.status(401).json(new ApiResponse(401, null, "Missing FullName"));
  }
  if (!email) {
    return res.status(401).json(new ApiResponse(401, null, "Eamil FullName"));
  }
  if (!username) {
    return res.status(401).json(new ApiResponse(401, null, "UserName Missing"));
  }
  if (!password) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "password FullName"));
  }
  const avatar = req.files?.avatar;
  const coverImage = req.files?.coverImage;

  if (!avatar) {
    return res.status(401).json(new ApiResponse(401, null, "avatar Missing"));
  }

  if (!coverImage) {
    return res.status(401).json(new ApiResponse(401, null, "avatar Missing"));
  }

  /**
   * *check if username , email and fullname is already exist
   */

  const isExistUser = await Usermodel.findOne({
    $or: [{ fullName }, { email }, { username }, { password }],
  });

  /**
   * todo : created data
   */
  const users = await new Usermodel.create({})

  console.log(isExistUser);
});

export { UserRegistration };
