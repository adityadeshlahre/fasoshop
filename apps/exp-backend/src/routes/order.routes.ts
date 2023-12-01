//need fix
import express from "express";
import {
  directOrder,
  order,
  orderHistory,
} from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();
router.get("/", authenticateUser, order);
router.get("/history", authenticateUser, orderHistory);
router.post("/d/:productId", authenticateUser, directOrder);

export default router;
