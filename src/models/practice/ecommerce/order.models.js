import { Schema, mongoose } from "mongoose"

const orderItemSchema = new Schema({
   productId: { type: mongoose.Schema.Types.objectId, ref: "Product" },
   quantity: { type: Number, required: true },
   price: { type: Number, required: true },
})

const OrderSchema = new Schema(
   {
      orderItems: { type: [orderItemSchema], required: true },
      customer: { type: mongoose.Schema.Types.objectId, ref: "User" },
      address: { type: String, required: true },
      status: { type: String, enum: ["PENDING", "CANCELLED", "DELIVERED"], default: "PENDING"}, // value of status can only be from enum

   },
   { timestamps: true })

export const Order = mongoose.model("order", OrderSchema)
