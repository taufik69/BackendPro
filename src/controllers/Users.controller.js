import { asyncHandler } from "../utils/AsyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Usermodel } from "../model/user.model.js";
import { cloudinaryFileUpload } from "../utils/Cloudinary.js";
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

  if (!avatar) {
    throw new ApiError(401, "Missing avatar");
  }

  const isExistUser = await Usermodel.find({
    $or: [{ fullName }, { email }, { username }, { password }],
  });

  if (isExistUser.length) {
    throw new ApiError(401, "User already exist");
  }

  /**
   * todo : upload file in cloudinary
   * function : cloudinaryFileUpload(parms:localpath)
   */

  const avatarCloudinary = await cloudinaryFileUpload(avatar[0].path);
  const coverImageCloudinary = await cloudinaryFileUpload(
    coverImage?.[0]?.path
  );

  /**
   * todo : created data
   */

  const users = await new Usermodel({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarCloudinary.url,
    coverImage: coverImageCloudinary?.url ?? "",
  }).save();

  /**
   * remove password ,RrefreshToken from users instance
   */
  const createdUser = await Usermodel.findById(users._id).select(
    "-password -RrefreshToken"
  );

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registration Successfull"));
});

export { UserRegistration };
