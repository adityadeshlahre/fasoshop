//need fix

import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { fetchProductsForSpecific } from "../lib/fetchProduct";

export const deleteCartProductHandler = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const userId = req.userId;
    const isAdmin = req.isAdmin || false;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: isAdmin ? null : Number(userId),
        adminId: isAdmin ? Number(userId) : null,
        productId: Number(productId),
      },
    });

    return res.status(200).json({ message: "Product deleted from the cart" });
  } catch (error) {
    console.error("Error deleting product from the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuantityHandler = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const userId = req.userId;
    const { quantity } = req.body;
    const isAdmin = req.isAdmin || false;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await prisma.cartItem.updateMany({
      where: {
        userId: isAdmin ? null : Number(userId),
        adminId: isAdmin ? Number(userId) : null,
        productId: Number(productId),
      },
      data: { quantity: Number(quantity) },
    });

    return res.status(200).json({ message: "Quantity updated in the cart" });
  } catch (error) {
    console.error("Error updating quantity in the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCartHandler = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const userId = req.userId;
    const isAdmin = req.isAdmin || false;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: isAdmin ? null : Number(userId),
        adminId: isAdmin ? Number(userId) : null,
        productId: Number(productId),
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    } else {
      const data = {
        quantity: 1,
        productId: Number(productId),
        userId: isAdmin ? null : Number(userId),
        adminId: isAdmin ? Number(userId) : null,
      };

      await prisma.cartItem.create({ data });
    }

    return res.status(200).json({ message: "Product added to the cart" });
  } catch (error) {
    console.error("Error adding product to the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCartProductsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin || false;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let cartProducts;

    if (!isAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { cartItems: true },
      });
      cartProducts = user?.cartItems || [];
    } else {
      const admin = await prisma.admin.findUnique({
        where: { id: Number(userId) },
        include: { cartItems: true },
      });
      cartProducts = admin?.cartItems || [];
    }

    return res.status(200).json(cartProducts);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return res.status(500).json({ error: `Internal server error` });
  }
};

export const cart = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;
    const isAdmin = req.isAdmin || false;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const products = await fetchProductsForSpecific(userId, isAdmin);

    return res.json(products);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
});
