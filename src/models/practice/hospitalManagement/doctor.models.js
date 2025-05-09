import { mongoose, Schema } from "mongoose";

const DoctorSchema = new Schema({
	name: { type: String, required: true },
	salary: { type: Number, required: true },
	qualification: { type: String, required: true },
	experiencInYears: { type: Number, default: 0, required: true },
	worksInHospitals: [{ type: Schema.Types.ObjectId, ref: "Hospital" }],
});

export const Doctor = mongoose.model("doctor", DoctorSchema);
