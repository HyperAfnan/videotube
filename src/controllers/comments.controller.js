import mongoose from "mongoose";
import { Comment } from "../models/comments.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// TODO: comments feature for tweets too
const getVideoComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { videoId } = req.params;
	const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
	// TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
	// TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
