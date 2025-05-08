import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({credentials: true}));
app.use(express.json({limit: "32kb"}));
app.use(express.urlencoded({extended: true, limit: "32kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

app
  .listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  })
  .on("error", (error) => {
    console.error("Failed to start server:", error.message);
  });

export {app};
