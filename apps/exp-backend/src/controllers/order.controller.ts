//need fix
//null values fix
//product values fetching using productId
//CartItems aren't getting empty
//orderIs not being used as queue

import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

const fetchProductsForSpecific = async (userId: number, isAdmin: boolean) => {
  try {
    const result = isAdmin
      ? await prisma.admin.findUnique({
          where: { id: userId },
          include: {
            cartItems: {
              include: {
                product: true,
              },
            },
          },
        })
      : await prisma.user.findUnique({
          where: { id: userId },
          include: {
            cartItems: {
              include: {
                product: true,
              },
            },
          },
        });

    if (result) {
      const cartItems = result.cartItems || [];
      const products = cartItems.map((cartItem) => cartItem.product);
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
    const isAdmin: boolean = req.isAdmin || false;

    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }

    const products = await fetchProductsForSpecific(userId, isAdmin);

    const { productId, status } = req.body;

    const orderStatus = status === "1" ? "completed" : "pending";

    // If status is "1", move items to order history
    if (status === "1" && products.length > 0) {
      const total = products.reduce((acc, product) => acc + product.price, 0);

      // Create a new order
      let order;
      if (isAdmin) {
        order = await prisma.order.create({
          data: {
            userId: null,
            adminId: userId,
            productId,
            status: orderStatus,
            total,
          },
        });
      } else {
        order = await prisma.order.create({
          data: {
            userId,
            adminId: null,
            productId,
            status: orderStatus,
            total,
          },
        });
      }

      // Create order history
      await prisma.orderHistory.create({
        data: {
          userId: order.userId,
          adminId: order.adminId,
          productId,
          status: "completed",
          total: order.total,
        },
      });

      // Clear the user's cart
      await prisma.cartItem.updateMany({
        where: { userId },
        data: { quantity: 0 },
      });

      res.json({ message: "Order placed successfully" });
    } else {
      res.json({ message: "Order wans't successfully placed" });
    }
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const orderHistory = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;
    const isAdmin: boolean = req.isAdmin || false;

    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }

    // Retrieve order history for the user or admin
    const orderHistory = await prisma.orderHistory.findMany({
      where: {
        userId: isAdmin ? null : userId,
        adminId: isAdmin ? userId : null,
      },
    });

    res.json(orderHistory);
  } catch (error) {
    console.error("Error retrieving order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
