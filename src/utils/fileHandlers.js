import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { ApiError } from "./apiErrors.js";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImageOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;
		if (fs.statSync(localFilePath).size > 5000000)
			throw new ApiError(400, "File size exceeds 5MB limit");

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "image",
		});

		fs.unlinkSync(localFilePath);

		return response;
	} catch (err) {
		fs.unlinkSync(localFilePath);
		console.log("error uploading file to Cloudinary ", err);
	}
};
const uploadVideoOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "video",
		});

		fs.unlinkSync(localFilePath);

		return response;
	} catch (err) {
		fs.unlinkSync(localFilePath);
		console.log("error uploading file to Cloudinary ", err);
	}
};

const deleteImageOnCloudinary = async (imageUrl) => {
	try {
		if (!imageUrl) return null;

		const regex = /\/([a-zA-Z0-9]+)\.(jpg|jpeg|png|)$/i;
		const publicId = imageUrl.match(regex);

		const response = await cloudinary.uploader.destroy(publicId[1], {
			resource_type: "image",
		});
		return response;
	} catch (err) {
		console.log("error deleting image to Cloudinary ", err);
	}
};

const deleteVideoOnCloudinary = async (videoUrl) => {
	try {
		if (!videoUrl) return null;

		const regex = /\/([a-zA-Z0-9]+)\.mp4$/;
		const publicId = videoUrl.match(regex);

		const response = await cloudinary.uploader.destroy(publicId[1], {
			resource_type: "video",
		});
		return response;
	} catch (err) {
		console.log("error deleting video to Cloudinary ", err);
	}
};

export {
	deleteImageOnCloudinary,
	deleteVideoOnCloudinary,
	uploadImageOnCloudinary,
	uploadVideoOnCloudinary,
};
