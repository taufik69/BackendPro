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
    throw new ApiError(401, "Missing FullName");
  }
  if (!email) {
    throw new ApiError(401, "Missing email");
  }
  if (!username) {
    throw new ApiError(401, "Missing username");
  }
  if (!password) {
    throw new ApiError(401, "Missing password");
  }

  /**
   * *check if username , email and fullname is already exist
   */

  const coverImage = req.files?.coverImage;
  const avatar = req.files?.avatar;

  if (!coverImage) {
    throw new ApiError(401, "Missing coverImage");
  }

  if (!avatar) {
    throw new ApiError(401, "Missing avatar");
  }

  return;
  const isExistUser = await Usermodel.findOne({
    $or: [{ fullName }, { email }, { username }, { password }],
  });

  /**
   * todo : created data
   */
  const users = await new Usermodel.create({});
  console.log(users);
});

export { UserRegistration };
