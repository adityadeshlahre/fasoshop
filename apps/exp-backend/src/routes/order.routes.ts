//need fix
import express from "express";
import {
  directOrder,
  order,
  orderHistory,
  orderStatusUpdate,
  orderWithPendingStatus,
} from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();
router.get("/", authenticateUser, order);
router.get("/history", authenticateUser, orderHistory);
router.post("/d/:productId", authenticateUser, directOrder);
router.put("/edit", authenticateUser, orderStatusUpdate);
router.get("/pending", authenticateUser, orderWithPendingStatus);

export default router;
