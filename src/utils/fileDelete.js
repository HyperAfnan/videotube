import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteImageOnCloudinary = async (imageUrl) => {
	try {
		if (!imageUrl) return null;

		const regex = /\/([a-zA-Z0-9]+)\.jpg$/;
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
		})
		return response;
	} catch (err) {
		console.log("error deleting video to Cloudinary ", err);
	}
};

export { deleteImageOnCloudinary, deleteVideoOnCloudinary };
