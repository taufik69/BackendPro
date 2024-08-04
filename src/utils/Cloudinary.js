import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import { log } from "console";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNIDARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT,
});

/**
 * todo : upload cloudinary
 */

const cloudinaryFileUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(
      localFilePath ||
        "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        resource_type: "auto",
      }
    );
    if (uploadResult) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    console.error(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteCloudinaryFile = async (localFilePath = "taufik") => {
  try {
    if (!localFilePath) {
      return null;
    }

    //another code of deleting cloudinary image
    // const afterDelete = await cloudinary.uploader.destroy(
    //   "zegjtgifa1wc4rtrvep7"
    // );

    const afterdeleted = await cloudinary.api.delete_resources(
      [localFilePath],
      {
        type: "upload",
        resource_type: "image",
      }
    );

    return afterdeleted;
  } catch (error) {
    throw new ApiError(501, "cloudinary image delete failded " + error);
  }
};

export { cloudinaryFileUpload, deleteCloudinaryFile };
