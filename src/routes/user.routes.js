import { Router } from "express";
import { UserRegistration } from "../controllers/Users.controller.js";
const UserRouter = Router();

UserRouter.route("/registration").post(UserRegistration);

export { UserRouter };
