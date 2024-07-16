import { asyncHandler } from "../utils/AsyncHandaler.js";

const UserRegistration = asyncHandler((req, res) => {
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
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    console.log("error paisci");
  } else {
    console.log("No Error");
  }
});

export { UserRegistration };
