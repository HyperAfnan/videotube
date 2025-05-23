import { Router } from "express";
import { health } from "../controllers/health.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API health check endpoints
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     description: Check if the API is up and running
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API is up and running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.route("/").get(health);

export default router;
