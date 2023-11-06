import express from "express";
import {
  getProducts,
  addProduct,
  updatePrice,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", authMiddleware, addProduct);
router.put("/products/:id/price", authMiddleware, updatePrice);
router.delete("/products/:id", authMiddleware, deleteProduct);

export default router;
