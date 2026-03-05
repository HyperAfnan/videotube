import mongoose from "mongoose";
import ENV from "./env.js";

const connectDB = async () => {
	try {
		await mongoose.connect(`${ENV.MONGODB_URI}`, {
			dbName: "videotube",
		});
	} catch (e) {
		throw e;
	}
};

export default connectDB;
