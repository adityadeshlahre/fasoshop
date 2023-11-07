import express from "express";
import {
  getProducts,
  addProduct,
  updatePrice,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", authenticateUser, addProduct);
router.put("/products/:id/price", authenticateUser, updatePrice);
router.delete("/products/:id", authenticateUser, deleteProduct);

export default router;
