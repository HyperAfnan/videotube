import express from "express";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.get("/health", (req, res) => {
  res.json({status: "working"});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
