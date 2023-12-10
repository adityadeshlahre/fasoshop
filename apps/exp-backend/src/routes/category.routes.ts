//need fix
import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesWithProducts,
  getProductsInCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller";
import { authenticateUser } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/", authenticateUser, createCategory);
router.delete("/:name", authenticateUser, deleteCategory);
router.put("/:name", authenticateUser, updateCategory);
router.get("/", getCategories);
router.get("/:id", getCategoriesWithProducts);
router.get("/:id/products", getProductsInCategory);
router.get("/:id/single", getSingleCategory);
export default router;
