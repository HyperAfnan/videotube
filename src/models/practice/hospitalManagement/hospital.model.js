import { mongoose, Schema } from "mongoose";

const HospitalSchema = new Schema({
	name: { type: String, requied: true },
	address: { type: String, requied: true },
	pincode: { type: String, requied: true },
	Specialization: { type: String, requied: true },
});

export const Hospital = mongoose.model("hospital", HospitalSchema);
