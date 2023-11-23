//need fix

import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

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

export const order = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;
    console.log(userId);
    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }
    const product = fetchProductsForSpecific(userId);
    console.log(product);

    // const { productId, user } = req.body;
    // const status = user === "yes" ? "completed" : "pending";

    // const order = await prisma.order.create({
    //   data: {
    //     userId,
    //     adminId: null,
    //     productId,
    //     status,
    //     total: 0,
    //   },
    // });

    // const cartItems = await prisma.cartItem.findMany({
    //   where: { userId },
    // });

    // await prisma.cartItem.updateMany({
    //   where: { userId },
    //   data: { quantity: 0 },
    // });

    res.json(product);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const orderHistory = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        status: "completed",
      },
    });

    if (order) {
      const orderHistory = await prisma.orderHistory.create({
        data: {
          userId: order.userId,
          adminId: order.adminId,
          productId: order.productId,
          status: "completed",
          total: order.total,
        },
      });

      res.json(orderHistory);
    } else {
      res.status(400).json({ error: "Order not found or not completed" });
    }
  } catch (error) {
    console.error("Error creating order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
