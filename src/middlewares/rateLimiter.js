import { rateLimit } from "express-rate-limit";

export const defaultRateLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: { error: "Too many requests, please try again later." },
})

export const authRateLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 10,
   message: { error: "Too many requests, please try again later." },
})
