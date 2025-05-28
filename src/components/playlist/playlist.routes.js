import { Router } from "express";
import {
	addVideoToPlaylist,
	createPlaylist,
	deletePlaylist,
	getPlaylistById,
	getUserPlaylists,
	removeVideoFromPlaylist,
	updatePlaylist,
} from "./playlist.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
	addVideoToPlaylistValidator,
	createPlaylistValidator,
	deletePlaylistValidator,
	getPlaylistByIdValidator,
	getUserPlaylistsValidator,
	playlistIdValidator,
	removeVideoFromPlaylistValidator,
	updatePlaylistValidator,
	userIdValidator,
} from "./playlist.validator.js";
import { validator } from "../../middlewares/validator.middleware.js";
import { videoIdValidator } from "../comment/comment.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: API endpoints for managing playlists
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the playlist
 *         name:
 *           type: string
 *           description: Name of the playlist
 *         description:
 *           type: string
 *           description: Description of the playlist
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of video IDs in the playlist
 *         owner:
 *           type: string
 *           description: User ID of the playlist owner
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     description: Create a new playlist for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the playlist
 *               description:
 *                 type: string
 *                 description: Description of the playlist
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.route("/").post(createPlaylistValidator, validator, createPlaylist);

/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     summary: Get a playlist by ID
 *     tags: [Playlists]
 *     description: Retrieve a playlist and its videos by playlist ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist retrieved successfully
 *       404:
 *         description: Playlist not found
 *       401:
 *         description: Unauthorized
 *
 *   patch:
 *     summary: Update a playlist
 *     tags: [Playlists]
 *     description: Update an existing playlist's name or description
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the playlist
 *               description:
 *                 type: string
 *                 description: New description for the playlist
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - User doesn't own this playlist
 *       404:
 *         description: Playlist not found
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     description: Delete an existing playlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 *       403:
 *         description: Forbidden - User doesn't own this playlist
 *       404:
 *         description: Playlist not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/:playlistId")
	.get(
		getPlaylistByIdValidator,
		validator,
		playlistIdValidator,
		getPlaylistById
	)
	.patch(
		updatePlaylistValidator,
		validator,
		playlistIdValidator,
		updatePlaylist
	)
	.delete(
		deletePlaylistValidator,
		validator,
		playlistIdValidator,
		deletePlaylist
	);

/**
 * @swagger
 * /playlists/add/{videoId}/{playlistId}:
 *   patch:
 *     summary: Add video to playlist
 *     tags: [Playlists]
 *     description: Add a video to an existing playlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID to add to the playlist
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID to add the video to
 *     responses:
 *       200:
 *         description: Video added to playlist successfully
 *       403:
 *         description: Forbidden - User doesn't own this playlist
 *       404:
 *         description: Playlist or video not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/add/:videoId/:playlistId")
	.patch(
		addVideoToPlaylistValidator,
		validator,
		videoIdValidator,
		playlistIdValidator,
		addVideoToPlaylist
	);

/**
 * @swagger
 * /playlists/remove/{videoId}/{playlistId}:
 *   patch:
 *     summary: Remove video from playlist
 *     tags: [Playlists]
 *     description: Remove a video from an existing playlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID to remove from the playlist
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID to remove the video from
 *     responses:
 *       200:
 *         description: Video removed from playlist successfully
 *       403:
 *         description: Forbidden - User doesn't own this playlist
 *       404:
 *         description: Playlist or video not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/remove/:videoId/:playlistId")
	.patch(
		removeVideoFromPlaylistValidator,
		validator,
		videoIdValidator,
		playlistIdValidator,
		removeVideoFromPlaylist
	);

/**
 * @swagger
 * /playlists/user/{userId}:
 *   get:
 *     summary: Get user's playlists
 *     tags: [Playlists]
 *     description: Retrieve all playlists created by a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID whose playlists to retrieve
 *     responses:
 *       200:
 *         description: User's playlists retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/user/:userId")
	.get(getUserPlaylistsValidator, validator, userIdValidator, getUserPlaylists);

export default router;
