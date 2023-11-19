import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { cartProductImg } from "../utils/filter.images";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", authenticateUser, addProduct);
router.put("/products/:id", authenticateUser, updateProduct);
router.delete("/products/:id", authenticateUser, deleteProduct);
router.get("/user", authenticateUser, cartProductImg);

export default router;
