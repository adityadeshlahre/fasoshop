//need fix
import express from "express";
import {
  getCategoriesHandler,
  getCategoryHandler,
  getProductsInCategoryHandler,
  getProductsInCategorySortedHandler,
} from "../controllers/category.controller";
const router = express.Router();

router.get("/", getCategoriesHandler);
router.get("/:id", getCategoryHandler);
router.get("/:id/products", getProductsInCategoryHandler);
router.get("/:id/products/sort/:sortType", getProductsInCategorySortedHandler);

export default router;
