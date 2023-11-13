import express from "express";
import {
  getProducts,
  addProduct,
  updatePrice,
  deleteProduct,
} from "../controllers/product.controller";
import { adminMiddleware } from "../middleware/admin.middleware";
import { fetchImages } from "../utils/image.fetch";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", adminMiddleware, addProduct);
router.put("/products/:id/price", adminMiddleware, updatePrice);
router.delete("/products/:id", adminMiddleware, deleteProduct);
router.get("/img", fetchImages);

export default router;
