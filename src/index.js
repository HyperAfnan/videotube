import {config} from "dotenv";
config();

import connectDB from "./db/index.js";
import {app} from "./app.js";

connectDB();

app;
