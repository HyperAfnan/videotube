import { OAuth2Client } from "google-auth-library";
import ENV from "../../config/env.js";
import { User } from "../user/user.model.js";
import { serviceHandler } from "../../utils/handlers.js";

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
const verifyToken = serviceHandler(async (token) => {
   const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
   });

   const payload = ticket.getPayload();

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
 * Find or create user from Google profile
 * @param {Object} googleProfile - Google user profile
 * @returns {Promise<Object>} User document
 */
// NOTE: redis candidate for caching user lookups
const findOrCreateUser = serviceHandler(async (googleProfile) => {
   // Check if user exists with Google ID
   let user = await User.findOne({ googleId: googleProfile.googleId });

   if (user) user;

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

   // Create new user
   user = await User.create({
      googleId: googleProfile.googleId,
      email: googleProfile.email,
      fullname: googleProfile.name,
      username: await this.generateUsername(googleProfile.email),
      avatar: googleProfile.picture,
      isEmailConfirmed: googleProfile.emailVerified,
      authProvider: "google",
   });

   return user;
});

/**
 * Generate unique username from email
 * @param {string} email - User email
 * @returns {Promise<string>} Unique username
 */
const generateUsername = serviceHandler(async (email) => {
   const baseUsername = email.split("@")[0].toLowerCase();
   let username = baseUsername;
   let counter = 1;

   // makes user2 username if user1 is taken
   while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
   }

   return username;
});

export { verifyToken, findOrCreateUser, generateUsername };
