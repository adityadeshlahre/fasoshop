//need fix [ routes check ]

import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { categoryModelSchema } from "../models/category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = categoryModelSchema.safeParse(req.body);
    if (!categoryData.success) {
      res.status(411).json({
        error: categoryData.error,
      });
      return;
    }
    const name = categoryData.data.name.toUpperCase();
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required for the category" });
    }
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: name,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category already exsits" });
    }
    const category = await prisma.category.create({
      data: {
        name: name,
      },
    });
    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const name = String(req.params.name).toUpperCase();
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required for the category" });
    }
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: name,
      },
    });
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    const category = await prisma.category.delete({
      where: { name: name },
    });

    return res
      .status(201)
      .json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryName = String(req.params.name).toUpperCase();
    const categoryData = categoryModelSchema.safeParse(req.body);
    if (!categoryData.success) {
      res.status(411).json({
        error: categoryData.error,
      });
      return;
    }
    const name = categoryData.data.name.toUpperCase();
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required for the category" });
    }
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: categoryName,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    const updatedCategory = await prisma.category.update({
      where: {
        name: categoryName,
      },
      data: {
        name: name,
        updatedAt: new Date(),
      },
    });

    return res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoriesWithProducts = async (
  req: Request,
  res: Response
) => {
  const categoryId = String(req.params.id).toUpperCase();

  try {
    const category = await prisma.category.findUnique({
      where: { name: categoryId },
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

export const getProductsInCategory = async (req: Request, res: Response) => {
  const categoryId = String(req.params.id).toUpperCase();
  try {
    const categories = await prisma.category.findUnique({
      where: { name: categoryId },
      include: { products: true },
    });
    return res.status(200).json(categories?.products);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleCategory = async (req: Request, res: Response) => {
  const categoryName = String(req.params.id).toUpperCase();
  try {
    const categories = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching products in all categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
