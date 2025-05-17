import { Schema, mongoose } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema(
	{
		content: { type: String, required: true },
		title: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "user" },
	},
	{ timestamps: true }
);

tweetSchema.plugin(mongooseAggregatePaginate)


export const Tweet = mongoose.model("tweet", tweetSchema);
