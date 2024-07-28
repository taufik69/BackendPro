import { Router } from "express";
import {
  UserLogin,
  UserRegistration,
} from "../controllers/Users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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
export { UserRouter };
