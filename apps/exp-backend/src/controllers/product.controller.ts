import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";
import { fetchImages } from "../utils/image.fetch";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadImage = (req: Request, res: Response) => {};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const userId: number | undefined = req.userId;
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        // user: { connect: { id: userId } },
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
    const { name, description, price, imageUrl } = req.body;
    const userId: number | undefined = req.userId;
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        imageUrl,
        admin: { connect: { id: userId } },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product price:", error);
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
