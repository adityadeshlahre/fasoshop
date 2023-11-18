//need fix

import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

export const deleteCartProductHandler = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const userId = req.userId;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await prisma.cartItem.deleteMany({
      where: { userId, productId: Number(productId) },
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

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await prisma.cartItem.updateMany({
      where: { userId, productId: Number(productId) },
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

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const admin = await prisma.admin.findUnique({ where: { id: userId } });

    const data = {
      quantity: 1,
      productId: Number(productId),
      userId: user?.id,
      adminId: admin?.id,
    };

    await prisma.cartItem.create({ data });

    return res.status(200).json({ message: "Product added to the cart" });
  } catch (error) {
    console.error("Error adding product to the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCartProductsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cartItems: true },
    });

    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      include: { cartItems: true },
    });

    const cartProducts = user?.cartItems || admin?.cartItems || [];

    return res.status(200).json(cartProducts);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const cart = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const products = await fetchProductsForSpecific(userId);

    return res.json(products);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchProductsForSpecific = async (userId: number) => {
  try {
    const userWithProducts = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    const adminWithProducts = await prisma.admin.findUnique({
      where: { id: userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (userWithProducts || adminWithProducts) {
      const cartItems =
        (userWithProducts || adminWithProducts)?.cartItems || [];
      const products = cartItems.map((cartItem) => cartItem.product);
      console.log(products);
      return products;
    } else {
      console.log("User or admin not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching products for user or admin:", error);
    throw error;
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
});
