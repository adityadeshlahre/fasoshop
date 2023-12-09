import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const categoryId = category.toUpperCase();
    const userId: number | undefined = req.userId;
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    let existingCategory = await prisma.category.findUnique({
      where: { name: categoryId },
    });
    if (!existingCategory) {
      existingCategory = await prisma.category.create({
        data: {
          name: categoryId,
        },
      });
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category: {
          connect: {
            id: existingCategory.id,
          },
        },
        admin: { connect: { id: userId } },
      },
    });

    res.json(newProduct);
  } catch (error) {
    console.error("Error creating a product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId: number = Number(req.params.id);
    const { name, description, price, imageUrl, category } = req.body;
    const categoryId: string = category.toUpperCase();
    const userId: number | undefined = req.userId;
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    let existingCategory = await prisma.category.findUnique({
      where: { name: categoryId },
    });
    if (!existingCategory) {
      existingCategory = await prisma.category.create({
        data: {
          name: categoryId,
        },
      });
    }
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        imageUrl,
        category: {
          connect: {
            id: existingCategory.id,
          },
        },
        admin: { connect: { id: userId } },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
process.on("SIGINT", () => {
  prisma.$disconnect();
});
