import { Schema, mongoose } from "mongoose";

const PlaylistSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		videos: { type: Schema.Types.ObjectId, ref: "video" },
		owner: { type: Schema.Types.ObjectId, ref: "user" },
	},
	{ timeseries: true }
);

export const Playlist = mongoose.model("playlist", PlaylistSchema);
