import { asyncHandler } from "../utils/AsyncHandaler.js";

const UserRegistration = asyncHandler((req, res, next) => {
  res.json({
    message: "Ok",
  });
});

export { UserRegistration };
