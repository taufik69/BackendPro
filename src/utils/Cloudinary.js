import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

export { cloudinaryFileUpload };
