import express from "express";
import {
  addToCartHandler,
  getCartProductsHandler,
  cart,
} from "../controllers/cart.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/list", authenticateUser, getCartProductsHandler);
router.put("/update/:id", authenticateUser, addToCartHandler);
//quantiy
//delete
router.get("/cart", authenticateUser, cart);

export default router;
