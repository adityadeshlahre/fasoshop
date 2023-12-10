import express from "express";
import {
  addToCart,
  getCartProducts,
  cart,
  updateQuantity,
  deleteCartProduct,
} from "../controllers/cart.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/list", authenticateUser, getCartProducts);
router.post("/add/:id", authenticateUser, addToCart);
router.put("/update/:id", authenticateUser, updateQuantity);
router.delete("/delete/:id", authenticateUser, deleteCartProduct);
router.get("/cart", authenticateUser, cart);

export default router;
