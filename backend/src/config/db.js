import mongoose from "mongoose";
import ENV from "./env.js";
// import { initCollections } from "./initCollections.js";

const connectDB = async () => {
	try {
		await mongoose.connect(`${ENV.MONGODB_URI}`, {
			dbName: "videotube",
		});
		// await initCollections();
	} catch (e) {
		throw e;
	}
};

export default connectDB;
