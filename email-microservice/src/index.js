import { connectRabbitMQ, getChannel, closeRabbitMQ } from "./config/rabbit.js";
import { logger } from "./utils/logger/index.js";
import { transporter } from "./config/nodemailer.js";
const emailServiceLogger = logger.child({ service: "emailService" });
const consumerLogger = logger.child({ service: "emailService.consumer" });
import env from "./config/env.js";
import { templates } from "./templates.js";

const sendEmail = async (to, subject, html) => {
   try {
      const mailOptions = {
         from: env.BREVO_EMAIL_FROM,
         to,
         subject,
         html,
      };

      emailServiceLogger.info(`Sending email to ${to} with subject ${subject}`);

      await transporter
         .sendMail(mailOptions)
         .then(() => logger.info(`Email sent successfully to ${to}`))
         .catch((err) =>
            emailServiceLogger.error(`Error sending email: ${err.message} `, {
               error: err,
               to,
               subject,
            }),
         );
   } catch (error) {
      emailServiceLogger.error("Unexpected error in sendEmail:", error);
      throw error;
   }
};

try {
   await connectRabbitMQ();
   const channel = getChannel();

   consumerLogger.info(`Email consumer starting on port ${env.port}...`);

   channel.consume(
      "email_queue",
      async (msg) => {
         if (msg !== null) {
            try {
               const taskData = JSON.parse(msg.content.toString());

               if (taskData.type === "registration") {
                  var { subject, html } = templates.registration(taskData.userMeta.username, taskData.token);
               } else if (taskData.type === "resetPassword") {
                  var { subject, html } = templates.resetPassword(taskData.token);
               } else if (taskData.type === "welcome") {
                  var { subject, html } = templates.welcome(taskData.userMeta.username);
               } else {
                  throw new Error(`No email template found for type: ${taskData.type}`);
               }
               await sendEmail(taskData.userMeta.email, subject, html);

               channel.ack(msg);

               consumerLogger.info("Task processed and acknowledged successfully");
            } catch (error) {
               consumerLogger.error("Error processing task:", error);
               consumerLogger.error("Error details:", {
                  message: error.message,
                  stack: error.stack,
               });

               channel.nack(msg, false, false);
            }
         }
      },
      {
         noAck: false,
      },
   );

   process.on("SIGINT", async () => {
      consumerLogger.info("Shutting down gracefully...");
      await closeRabbitMQ();
      process.exit(0);
   });

   process.on("SIGTERM", async () => {
      consumerLogger.info("Shutting down gracefully...");
      await closeRabbitMQ();
      process.exit(0);
   });
} catch (error) {
   consumerLogger.error("Failed to start consumer:", error);
   process.exit(1);
}
