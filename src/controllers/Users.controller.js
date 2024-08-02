import { asyncHandler } from "../utils/AsyncHandaler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Usermodel } from "../model/user.model.js";
import { cloudinaryFileUpload } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await Usermodel.findById(userId);
    const acessToken = await user.generateAccessToken();
    const RrefreshToken = await user.generateRefreshToken();
    user.RrefreshToken = RrefreshToken;
    await user.save({ validateBeforeSave: false });
    return { RrefreshToken, acessToken };
  } catch (error) {
    throw new ApiError(401, error.message);
  }
};

const options = {
  httpOnly: true,
  secure: true,
};

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

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(401, "UserName or email required");
  }

  const ExistUser = await Usermodel.findOne({ $or: [{ username }, { email }] });
  if (!ExistUser) {
    throw new ApiError(401, "User not found !!");
  }

  const isPasswordCorrect = await ExistUser.isCorrectPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "User Credential Wrong  !!");
  }

  const { RrefreshToken, acessToken } = await generateAcessAndRefreshToken(
    ExistUser._id
  );
  // eixist user have all field , but i dont want to need some field like refreshtoken and password

  const loggedUser = await Usermodel.findById(ExistUser._id).select(
    "-RrefreshToken  -password"
  );

  return res
    .status(200)
    .cookie("accessToken", acessToken, options)
    .cookie("refreshToken", RrefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          acessToken: acessToken,
          RrefreshToken: RrefreshToken,
        },
        "Login Sucessfull"
      )
    );
});

// logout the user

const userLogout = asyncHandler(async (req, res) => {
  // undifined the refresh token
  let hel = await Usermodel.findByIdAndUpdate(
    { _id: req.user?._id },
    {
      $set: {
        RrefreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  // now clear the cookie from the server
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, hel, "Logout Sucessfull"));
});

// fresing the acces token / or regenerate the access token

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorize request");
  }

  // now decode the refreshToken via jwt.verify method
  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SCCERET
    );
    const user = await Usermodel.findById(decodeToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token user not found");
    }

    if (incomingRefreshToken !== user.RrefreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { RrefreshToken, acessToken } = await generateAcessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", acessToken, options)
      .cookie("refreshToken", RrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            acessToken: acessToken,
            RrefreshToken: RrefreshToken,
          },
          "Access Token  Refresh"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

// change password

const changeOldPassword = asyncHandler(async (req, res) => {
  const { newPassword, oldpassword } = req.body;
  console.log(req.user);
});

export {
  UserRegistration,
  UserLogin,
  userLogout,
  refreshAccessToken,
  changeOldPassword,
};
