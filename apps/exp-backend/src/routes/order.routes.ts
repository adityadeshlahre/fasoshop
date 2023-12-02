//need fix
import express from "express";
import {
  directOrder,
  order,
  orderHistory,
  orderStatusUpdate,
} from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();
router.get("/", authenticateUser, order);
router.get("/history", authenticateUser, orderHistory);
router.post("/d/:productId", authenticateUser, directOrder);
router.put("/c/:orderId", authenticateUser, orderStatusUpdate);

export default router;
