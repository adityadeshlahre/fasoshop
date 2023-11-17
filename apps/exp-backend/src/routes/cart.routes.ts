import express from "express";
import {
  addToCartHandler,
  getCartProductsHandler,
} from "../controllers/cart.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/list", authenticateUser, getCartProductsHandler);
router.put("/update/:id", authenticateUser, addToCartHandler);

export default router;
