//need fix

import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

const addToCart = async (userId: number, productId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user) {
    await prisma.cartItem.create({
      data: {
        quantity: 1,
        productId: productId,
        userId: userId,
      },
    });
  } else {
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
    });

    if (admin) {
      await prisma.cartItem.create({
        data: {
          quantity: 1,
          productId: productId,
          adminId: userId,
        },
      });
    }
  }
};

const getCartProducts = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { cartItems: true },
  });

  const admin = await prisma.admin.findUnique({
    where: { id: userId },
    include: { cartItems: true },
  });

  return user?.cartItems || admin?.cartItems || [];
};

export const addToCartHandler = async (req: Request, res: Response) => {
  try {
    const productId: number = Number(req.params.id);
    const userId: number | undefined = req.userId;
    console.log(productId, userId);

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await addToCart(userId, productId);

    return res.status(200).json({ message: "Product added to the cart" });
  } catch (error) {
    console.error("Error adding product to the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCartProductsHandler = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const cartProducts = await getCartProducts(userId);

    return res.status(200).json(cartProducts);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
});
