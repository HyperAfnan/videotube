import { User } from "../../components/user/user.models.js";
import { serviceHandler } from "../../utils/handlers.js";
import debug from "debug";
const error = debug("worker:user:processor:error");
const log = debug("worker:user:processor:log");

export const deleteUnVerifiedUsers = serviceHandler( async () => {
   log("Starting to delete unverified users");

   const result = await User.deleteMany({ isEmailConfirmed: false })

   if (!result.acknowledged) {
      error("Failed to delete unerified users")
      throw new Error("Failed to delete unverified users")
   }
})
