//need fix
import express from "express";
import {
  addToCartHandler,
  getCartProductsHandler,
  cart,
  updateQuantityHandler,
  deleteCartProductHandler,
} from "../controllers/cart.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/list", authenticateUser, getCartProductsHandler);
router.post("/add/:id", authenticateUser, addToCartHandler);
router.put("/update/:id", authenticateUser, updateQuantityHandler);
router.delete("/delete/:id", authenticateUser, deleteCartProductHandler);
router.get("/cart", authenticateUser, cart);

export default router;
