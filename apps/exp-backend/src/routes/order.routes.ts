//need fix
import express from "express";
import { order, orderHistory } from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();
router.get("/", authenticateUser, order);
router.get("/history", authenticateUser, orderHistory);

export default router;
