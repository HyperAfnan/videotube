import { Schema, mongoose } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
	{
		content: { type: String, requuired: true },
		video: { type: Schema.Types.ObjectId, ref: "user" },
		user: { type: Schema.Types.ObjectId, ref: "video" },
	},
	{ timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("comment", commentSchema);
