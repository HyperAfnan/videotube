import { Router } from "express";
import {
   changePassword,
   confirmEmail,
   deleteUser,
   forgotPassword,
   loginUser,
   logoutUser,
   refreshAccessToken,
   registerUser,
   resetPassword,
   sendConfirmationEmail,
   googleLogin,
} from "./auth.controller.js";
// import { upload } from "../../middlewares/multer.middleware.js";
import { verifyAccessToken as auth } from "../../middlewares/auth.middleware.js";
import { validator } from "../../middlewares/validator.middleware.js";
import {
   changePasswordValidator,
   confirmEmailValidator,
   forgotPasswordValidator,
   loginValidator,
   refreshAccessTokenValidator,
   // registerationFilesValidator,
   registerValidator,
   resetPasswordValidator,
   sendConfirmationEmailValidator,
   googleAuthValidator,
} from "./auth.validator.js";
import {
   authRateLimiter,
   defaultRateLimiter,
} from "../../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(defaultRateLimiter);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for auth management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - fullname
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         username:
 *           type: string
 *           description: Unique username for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         fullname:
 *           type: string
 *           description: User's full name
 *         avatar:
 *           type: string
 *           description: URL to the user's avatar image
 *         coverImage:
 *           type: string
 *           description: URL to the user's cover image
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (not returned in responses)
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token for the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was last updated
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user with avatar and cover image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - fullname
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               fullname:
 *                 type: string
 *                 description: User's full name
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User's profile picture
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: User's cover image
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: User's username
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 fullname:
 *                   type: string
 *                   description: User's full name
 *                 avatar:
 *                   type: string
 *                   description: URL to user's avatar
 *                 coverImage:
 *                   type: string
 *                   description: URL to user's cover image
 *       400:
 *         description: Invalid input or username/email already exists
 */

// NOTE: file uploads are disabled for a while
router.route("/register").post(
   authRateLimiter,
   // upload.fields([
   // 	{ name: "avatar", maxCount: 1 },
   // 	{ name: "coverImage", maxCount: 1 },
   // ]),
   // registerationFilesValidator,
   registerValidator,
   validator,
   registerUser,
);

router
   .route("/sendConfirmEmail")
   .post(sendConfirmationEmailValidator, validator, sendConfirmationEmail);

/**
 * @swagger
 * /auth/confirmEmail/{confirmationToken}:
 *   get:
 *     summary: Confirm user email address
 *     tags: [Auth]
 *     description: Confirm a user's email address using a confirmation token sent to their email.
 *     parameters:
 *       - in: path
 *         name: confirmationToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Email confirmation token
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email confirmed successfully
 *       400:
 *         description: Invalid or expired confirmation token
 */
router
   .route("/confirmEmail/:confirmationToken")
   .get(authRateLimiter, confirmEmailValidator, validator, confirmEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     description: Authenticate a user and generate access & refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router
   .route("/login")
   .post(authRateLimiter, loginValidator, validator, loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: Invalidate user's refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized or invalid token
 */
router.route("/logout").post(authRateLimiter, auth, logoutUser);

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Generate new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: JWT refresh token
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: New JWT refresh token
 *       401:
 *         description: Invalid refresh token
 */
router
   .route("/refreshToken")
   .post(
      authRateLimiter,
      auth,
      refreshAccessTokenValidator,
      validator,
      refreshAccessToken,
   );

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     description: Send a password reset link to the user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent
 *       400:
 *         description: Invalid email or user not found
 */
router
   .route("/forgotPassword")
   .post(authRateLimiter, forgotPasswordValidator, validator, forgotPassword);

/**
 * @swagger
 * /auth/resetPassword/{token}:
 *   patch:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     description: Reset the user's password using a valid reset token.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password has been reset
 *       400:
 *         description: Invalid or expired token, or invalid password
 */
router
   .route("/resetPassword/:token")
   .patch(authRateLimiter, resetPasswordValidator, validator, resetPassword);

/**
 * @swagger
 * /auth/changePassword:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     description: Update the user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 description: User's current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: User's new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect old password or invalid new password
 *       401:
 *         description: Unauthorized
 */

router
   .route("/changePassword")
   .patch(
      defaultRateLimiter,
      auth,
      changePasswordValidator,
      validator,
      changePassword,
   );

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [Auth]
 *     description: Delete the current user's account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/delete").delete(authRateLimiter, auth, deleteUser);

/**
 * @swagger
 * /auth/googleLogin:
 *   post:
 *     summary: Login or register a user using Google OAuth
 *     tags: [Auth]
 *     description: Authenticate a user via Google OAuth and generate access & refresh tokens
 *     requestBody:
 *       required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged in successfully via Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       401:
 *         description: Invalid Google credentials
 */
router
   .route("/google")
   .post(authRateLimiter, googleAuthValidator, googleLogin);

export default router;
