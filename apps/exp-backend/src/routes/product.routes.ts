import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { fetchImages } from "../utils/image.fetch";
import { cart } from "../utils/filter.images";
import { fetchCollections } from "../utils/collectionId.fetch";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", authenticateUser, addProduct);
router.put("/products/:id", authenticateUser, updateProduct);
router.delete("/products/:id", authenticateUser, deleteProduct);
router.get("/img", fetchImages);
router.get("/mycart", cart);
router.get("/col", fetchCollections);

export default router;
