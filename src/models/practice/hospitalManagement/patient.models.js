import {mongoose, Schema} from "mongoose";

const PatientSchema = new Schema({
  name: {type: String, required: true},
  diagnosedWith: {type: String, required: true},
  address: {type: String, required: true},
  bloodGroup: {type: String, required: true},
  Gender: {type: String, required: true, enum: ["Male", "Female"]},
  age: {type: Number, required: true},
  admittedIn: {
    type: mongoose.Schema.Types.objectId,
    ref: "hospital",
    required: true,
  },
});

export const Patient = mongoose.model("patient", PatientSchema);
