import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import {config} from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (err) {
    console.error("Error uploading file to Cloudinary:", err);
    fs.unlinkSync(localFilePath); // removes the file from local if upload is failed
  }
};

export {uploadOnCloudinary};
