import nodemailer from "nodemailer";
import ENV from "./env.js";

export const transporter = nodemailer.createTransport({
	host: ENV.BREVO_SERVER_URL,
	port: ENV.BREVO_PORT,
	secure: false,
	auth: { user: ENV.BREVO_USERNAME, pass: ENV.BREVO_PASSWORD },
});

