import express from "express";
import {
  addToCartHandler,
  getCartProductsHandler,
} from "../utils/mutation.cart";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/list", authenticateUser, getCartProductsHandler);

router.put("/updatecart/:id", authenticateUser, addToCartHandler);

export default router;
