import { serviceHandler } from "../../utils/handlers.js";
import nodemailer from "nodemailer";
import ENV from "../../config/env.js";
import debug from "debug";
const log = debug("app:worker:email:processor:log");
const error = debug("app:worker:email:processor:error");

const transporter = nodemailer.createTransport({
   host:ENV.BREVO_SERVER_URL,
   port: ENV.BREVO_PORT,
   secure: false, 
	auth: { user: ENV.BREVO_USERNAME, pass: ENV.BREVO_PASSWORD },
});

export const sendEmail = serviceHandler( async (to, subject, html) => {
   const mailOptions = {
      from: ENV.BREVO_EMAIL_FROM,
      to,
      subject,
      html,
	};

   log(`Sending email to ${to} with subject ${subject} and html content ${html}`)

	await transporter
		.sendMail(mailOptions)
      .catch((err) => error("Error sending email: ", err))
});
