import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getCategoriesHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryHandler = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsInCategoryHandler = async (
  req: Request,
  res: Response
) => {
  const categoryId = req.params.id;

  try {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products in category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsInCategorySortedHandler = async (
  req: Request,
  res: Response
) => {
  const categoryId = req.params.id;

  try {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching sorted products in category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
