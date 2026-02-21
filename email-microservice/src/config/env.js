import dotenv from "dotenv";
dotenv.config({ quiet: true });

const ENV = {
  port: process.env.PORT || 3000,
  rabbitMQURL: process.env.RABBITMQ_URI,
  BREVO_EMAIL_FROM : process.env.BREVO_EMAIL_FROM,
  BREVO_SERVER_URL: process.env.BREVO_SERVER_URL,
  BREVO_PORT: parseInt(process.env.BREVO_PORT, 10) || 587,
  BREVO_USERNAME: process.env.BREVO_USERNAME,
  BREVO_PASSWORD: process.env.BREVO_PASSWORD,
};

const requiredKeys = [
   "rabbitMQURL", 
   "BREVO_EMAIL_FROM",
 	 "BREVO_USERNAME",
	 "BREVO_PASSWORD",
];

for (const key of requiredKeys) {
  if (!ENV[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default ENV;
