import mongoose from "mongoose";
import { exit } from "process";
import { DBNAME } from "../constants.js";

const DBConnection = async () => {
  try {
    const databaseInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${DBNAME}`
    );
    console.log(
      `MongoDB Connected !! DB HOST !! ${databaseInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error", error);
    exit(1);
  }
};

export default DBConnection;
