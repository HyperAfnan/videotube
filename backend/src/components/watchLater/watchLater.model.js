import { mongoose, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const watchLaterSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user", required: true },
		video: {
			type: Schema.Types.ObjectId,
			ref: "video",
			required: true,
			unique: true,
		},
	},
	{ timestamps: true },
);

watchLaterSchema.plugin(mongooseAggregatePaginate);

export const WatchLater = mongoose.model("watchLater", watchLaterSchema);
