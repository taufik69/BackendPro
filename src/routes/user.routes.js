import { Router } from "express";
import { UserRegistration } from "../controllers/Users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const UserRouter = Router();

UserRouter.route("/registration").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  UserRegistration
);

export { UserRouter };
