import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import userQueue from "../jobs/queues/user/user.normal.js";
import emailDeadLetterQueue from "../jobs/queues/email/email.deadletter.js";
import emailQueue from "../jobs/queues/email/email.normal.js";

export const setupBullBoard = (app) => {
   const serverAdapter = new ExpressAdapter();
   serverAdapter.setBasePath("/admin/queues");

   createBullBoard({
      queues: [
         new BullMQAdapter(userQueue),
         new BullMQAdapter(emailQueue),
         new BullMQAdapter(emailDeadLetterQueue)
      ],
      serverAdapter,
   });

   app.use("/admin/queues", serverAdapter.getRouter());
};
