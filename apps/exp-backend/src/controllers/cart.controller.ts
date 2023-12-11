import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { fetchProductsForSpecific } from "../lib/fetchProduct";
import { cartItemModelSchema } from "../models/cart";

export const deleteCartProduct = async (req: Request, res: Response) => {
  try {
    const { id: cardItemID } = req.params;

    if (!cardItemID) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        id: Number(cardItemID),
      },
    });
    if (!deletedCartItem) {
      return res.status(404).json({ error: "CartItem not found" });
    }

    return res.status(200).json({ message: "Product deleted from the cart" });
  } catch (error) {
    console.error("Error deleting product from the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { id: cardItemID } = req.params;
    const cartData = cartItemModelSchema.safeParse(req.body);
    if (!cartData.success) {
      res.status(411).json({
        error: cartData.error,
      });
      return;
    }
    const { quantity } = cartData.data;

    if (!cardItemID || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const updatingCartItem = await prisma.cartItem.update({
      where: {
        id: Number(cardItemID),
      },
      data: { quantity: Number(quantity) },
    });
    if (!updatingCartItem) {
      return res.status(404).json({ error: "CartItem not found" });
    }

    return res.status(200).json({ message: "Quantity updated in the cart" });
  } catch (error) {
    console.error("Error updating quantity in the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
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

export const getCartProducts = async (req: Request, res: Response) => {
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
