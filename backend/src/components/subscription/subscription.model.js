import { mongoose, Schema } from "mongoose";

const SubscriptionSchema = new Schema(
	{
		subscriber: {
			type: Schema.Types.ObjectId, // one who is subscribing
			ref: "user",
		},
		channel: {
			type: Schema.Types.ObjectId, // one who is being subscribed
			ref: "user",
		},
	},
	{ timestamps: true },
);

export const Subscription = mongoose.model("subscription", SubscriptionSchema);
