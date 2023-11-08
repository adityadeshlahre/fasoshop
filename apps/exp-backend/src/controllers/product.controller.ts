import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

// Get and send all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Implement image upload logic
export const uploadImage = (req: Request, res: Response) => {
  // Implement image upload logic here, e.g., using multer or cloud-based storage
  // Handle the file upload and store the image URL in the database
};

// Implement product creation logic
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, userId } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        user: { connect: { id: userId } }, // Associate the product with the user
      },
    });

    res.json(newProduct);
  } catch (error) {
    console.error("Error creating a product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Implement product price update logic
export const updatePrice = async (req: Request, res: Response) => {
  try {
    const { productId, newPrice } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { price: newPrice },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product price:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Implement product deletion logic
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);

    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Make sure to disconnect the Prisma client when the server shuts down
process.on("SIGINT", () => {
  prisma.$disconnect();
});
