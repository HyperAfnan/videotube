import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/videotube`);
    console.log(`DB Connected `);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default connectDB;
