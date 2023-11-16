import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { adminMiddleware } from "../middleware/admin.middleware";
import { fetchImages } from "../utils/image.fetch";
import { myCart } from "../utils/cart.fetch";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", adminMiddleware, addProduct);
router.put("/products/:id", adminMiddleware, updateProduct);
router.delete("/products/:id", adminMiddleware, deleteProduct);
router.get("/img", fetchImages);
router.get("/mycart", myCart);

export default router;
