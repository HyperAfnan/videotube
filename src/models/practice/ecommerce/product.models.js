import { Schema, mongoose } from "mongoose"

const ProductSchema = new Schema(
   {

      description: { type: String, required: true },
      name: { required: true, type: String },
      productImage: { type: String },
      price: { type: Number, default: 0, },
      stock: { type: Number, default: 0 },
      catagory: { type: mongoose.Schema.Types.objectId, ref: "Catagory", required: true },
      owner: { type: mongoose.Schema.Types.objectId, ref: "Owner", required: true }

   }, { Timestamp: true })

export const Product = mongoose.model("Product", ProductSchema)
