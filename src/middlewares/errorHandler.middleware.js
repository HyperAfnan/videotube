import ENV from "../config/env.js";

export const errorHandler = (err, _, res, next) => {
   if (err) {
      return res.status(err.status || 500).json({
         statusCode: err.status || 500,
         message: err.message || "Internal Server Error",
         stack: ENV.NODE_ENV === "development" ? err.stack : undefined,
      });
   }
   next();
}
