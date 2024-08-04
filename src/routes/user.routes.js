import { Router } from "express";
import {
  UserLogin,
  userLogout,
  UserRegistration,
  refreshAccessToken,
  changeOldPassword,
  getCurrentUser,
  updateAccouontDetails,
  updateAvatar,
  updateCoverImage,
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
UserRouter.route("/access-token").post(refreshAccessToken);
UserRouter.route("/changePassword").post(verifyJwt, changeOldPassword);
UserRouter.route("/get-currentUser").get(verifyJwt, getCurrentUser);
UserRouter.route("/update-Accouont").post(verifyJwt, updateAccouontDetails);
UserRouter.route("/update-avatar").patch(
  verifyJwt,
  upload.single("avatar"),
  updateAvatar
);
UserRouter.route("/update-coverImage").patch(
  verifyJwt,
  upload.single("coverImage"),
  updateCoverImage
);
export { UserRouter };
