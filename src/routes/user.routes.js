import { Router } from "express";
import {
  UserLogin,
  userLogout,
  UserRegistration,
} from "../controllers/Users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const UserRouter = Router();

UserRouter.route("/registration").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  UserRegistration
);

//login route
UserRouter.route("/login").post(UserLogin);
UserRouter.route("/logout").post(verifyJwt, userLogout);
export { UserRouter };
