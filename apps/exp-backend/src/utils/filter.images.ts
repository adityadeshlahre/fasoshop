//NEED FIX [this function will fetch all the required images of specific user]

import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";
const prisma = new PrismaClient();

export const cartProductImg = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const products = await fetchProductsImgForSpecific(userId);

    return res.json(products);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchProductsImgForSpecific = async (userId: number) => {
  try {
    const userWithProducts = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const adminWithProducts = await prisma.admin.findUnique({
      where: { id: userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                imageUrl: true,
              },
            },
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
