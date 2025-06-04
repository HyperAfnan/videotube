import { serviceHandler } from "../../utils/handlers.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	server: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
});

export const sendRegistrationEmail = serviceHandler(async (username, to, text) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject: `Email Verification ${username} | Welcome to VideoTube`,
		text,
	};

	await transporter
		.sendMail(mailOptions)
		.catch((error) => console.log("Error snding email: ", error));
});
