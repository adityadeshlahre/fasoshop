import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

// Function to add a product to the cart
const addToCart = async (userId: number, productId: number) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user) {
    // Add the product to the user's cart
    await prisma.cartItem.create({
      data: {
        quantity: 1, // You can set the quantity as needed
        productId: productId,
        userId: userId,
      },
    });
  } else {
    // Check if the admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
    });

    if (admin) {
      // Add the product to the admin's cart
      await prisma.cartItem.create({
        data: {
          quantity: 1, // You can set the quantity as needed
          productId: productId,
          adminId: userId,
        },
      });
    }
  }
};

// Function to get products in the cart based on token
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

// Express route handler to add a product to the cart
export const addToCartHandler = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId: number | undefined = req.userId;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Add the product to the cart
    await addToCart(userId, productId);

    return res.status(200).json({ message: "Product added to the cart" });
  } catch (error) {
    console.error("Error adding product to the cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Express route handler to get products in the cart
export const getCartProductsHandler = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Get products in the cart based on userId
    const cartProducts = await getCartProducts(userId);

    return res.status(200).json(cartProducts);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
