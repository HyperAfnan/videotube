import mongoose from "mongoose";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectDB = async () => {
   try {
      await mongoose.connect(`${process.env.MONGODB_URI}`, clientOptions)
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log(`DB Connected `)
   } catch (e) {
      console.error(e);
      throw e;
   }
}

export default connectDB
