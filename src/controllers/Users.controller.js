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

// login the users

const UserLogin = asyncHandler(async (req, res) => {
  /**
   * todo : 1) extract data from req.body
   * todo : 2) users can gives email or username anything , but accept both of this
   * todo : 3) find the user if already this user register
   * todo : 4) checking the password
   * todo : 5) aceess and refresh token
   * todo : 6) send access toekn via cookies
   */
  const generateAcessAndRefreshToken = async (userId) => {
    try {
      const user = await Usermodel.findById(userId);
      const acessToken = await user.generateAccessToken();
      const RrefreshToken = await user.generateRefreshToken();
      user.RrefreshToken = RrefreshToken;
      user.save({ validateBeforeSave: false });
      console.log(user);
    } catch (error) {
      throw new ApiError(401, error.message);
    }
  };

  const { username, email, password } = req.body;

  const ExistUser = await Usermodel.findOne({ $or: [{ username }, { email }] });
  if (!ExistUser) {
    throw new ApiError(401, "User not found !!");
  }

  const isPasswordCorrect = await ExistUser.isCorrectPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "User Credential Wrong  !!");
  }

  generateAcessAndRefreshToken(ExistUser._id);
});

export { UserRegistration, UserLogin };
