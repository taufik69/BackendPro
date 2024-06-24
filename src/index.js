// require("dotenv").config({ path: "/.env" });
import dotenv from "dotenv";
import DBConnection from "./Database/index.js";
dotenv.config({ path: "/.env" });
DBConnection();
