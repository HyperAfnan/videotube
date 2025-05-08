import {Router} from "express";
import {health} from "../controllers/health.controller.js";

const router = Router();

router.route("/").get(health);

export default router;
