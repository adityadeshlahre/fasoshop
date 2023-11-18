import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { fetchImages } from "../utils/image.fetch";
import {
  fetchCollectionInfo,
  fetchCollections,
} from "../utils/collectionId.fetch";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", authenticateUser, addProduct);
router.put("/products/:id", authenticateUser, updateProduct);
router.delete("/products/:id", authenticateUser, deleteProduct);
router.get("/img/:id", fetchImages);
router.get("/collection", fetchCollections);
router.get("/collection/:idOrTitle", fetchCollectionInfo);

export default router;
