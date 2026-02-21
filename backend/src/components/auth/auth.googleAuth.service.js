import { OAuth2Client } from "google-auth-library";
import ENV from "../../config/env.js";
import { User } from "../user/user.model.js";
import { serviceHandler } from "../../utils/handlers.js";
import { logger } from "../../utils/logger/index.js";

const googleAuthServiceLogger = logger.child({ module: "googleAuth.service" });

const client = new OAuth2Client(
   ENV.GOOGLE_CLIENT_ID,
   ENV.GOOGLE_CLIENT_SECRET,
   ENV.GOOGLE_REDIRECT_URI,
);

/**
 * Verify Google ID token and extract user info
 * @param {string} token - Google ID token from frontend
 * @returns {Promise<Object>} User info from Google
 */
const verifyToken = serviceHandler(async (tokenId) => {
   googleAuthServiceLogger.info("Verifying Google ID token");
   const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: ENV.GOOGLE_CLIENT_ID,
   });

   const payload = ticket.getPayload();
   googleAuthServiceLogger.info("Google ID token verified successfully");

   return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      name: payload.name,
      picture: payload.picture,
      givenName: payload.given_name,
      familyName: payload.family_name,
   };
});

/**
 * Generate unique username from email
 * @param {string} email - User email
 * @returns {Promise<string>} Unique username
 */
const generateUsername = serviceHandler(async (email) => {
   googleAuthServiceLogger.debug("Generating unique username from email");
   const baseUsername = email.split("@")[0].toLowerCase();
   let username = baseUsername;
   let counter = 1;

   // makes user2 username if user1 is taken

   googleAuthServiceLogger.debug("Checking for existing usernames");
   while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
   }

   return username;
});

/**
 * Find or create user from Google profile
 * @param {Object} googleProfile - Google user profile
 * @returns {Promise<Object>} User document
 */
// NOTE: redis candidate for caching user lookups and creations
const findOrCreateUser = serviceHandler(async (googleProfile) => {
   googleAuthServiceLogger.debug("Finding or creating user from Google profile");
   // Check if user exists with Google ID
   let user = await User.findOne({ googleId: googleProfile.googleId });

   if (user) user;

   googleAuthServiceLogger.debug("User found with Google ID");
   // Check if user exists with email
   user = await User.findOne({ email: googleProfile.email });

   if (user) {
      // Link Google account to existing user
      user.googleId = googleProfile.googleId;
      user.avatar = user.avatar || googleProfile.picture;
      user.isEmailConfirmed = googleProfile.emailVerified;
      await user.save();
      return user;
   }

   googleAuthServiceLogger.debug("No existing user found, creating new user");
   user = await User.create({
      googleId: googleProfile.googleId,
      email: googleProfile.email,
      fullname: googleProfile.name,
      username: await generateUsername(googleProfile.email),
      avatar: googleProfile.picture,
      isEmailConfirmed: googleProfile.emailVerified,
      authProvider: "google",
   });

   return user;
});

export { verifyToken, generateUsername, findOrCreateUser};
