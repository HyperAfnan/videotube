import { serviceHandler } from "../../utils/handlers.js";
import nodemailer from "nodemailer";
import ENV from "../../config/env.js";
import { logger } from "../../utils/logger/index.js";

const transporter = nodemailer.createTransport({
	host: ENV.BREVO_SERVER_URL,
	port: ENV.BREVO_PORT,
	secure: false,
	auth: { user: ENV.BREVO_USERNAME, pass: ENV.BREVO_PASSWORD },
});

export const sendEmail = serviceHandler(async (to, subject, html) => {
	const mailOptions = {
		from: ENV.BREVO_EMAIL_FROM,
		to,
		subject,
		html,
	};

	logger.info( `Sending email to ${to} with subject ${subject}`);

	await transporter
		.sendMail(mailOptions)
		.catch((err) => 
         logger.error(`Error sending email: ${err.message} `, { error: err, to: to, subject: subject })
   );
});
