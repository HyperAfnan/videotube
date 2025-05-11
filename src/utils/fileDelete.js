import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteOnCloudinary = async (imageUrl) => {
	// get image url from db,
	// extract image's public id from url,
	// called destroy function to delete image

	try {
		if (!imageUrl) return null;

		const regex = /\/([a-zA-Z0-9]+)\.jpg$/;
		const publicId = imageUrl.match(regex);

		const response = await cloudinary.uploader.destroy(publicId[1], {
			resource_type: "image",
		});
		return response;
	} catch (err) {
		console.error("Error deleting file to Cloudinary:", err);
	}
};

export { deleteOnCloudinary };
