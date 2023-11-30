//need fix
//null values fix
//product values fetching using productId
//orderIs not being used as queue

import { Request, Response } from "express";
import prisma from "../lib/prisma";

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
    if (products.length === 0) {
      return res.json({ message: "Cart is empty" });
    }
    const product = products[0];
    const { status } = req.body;
    const orderStatus = status === "1" ? "completed" : "pending";

    if (status && products.length > 0) {
      const total = products.reduce((acc, product) => acc + product.price, 0);

      let order;
      if (isAdmin) {
        order = await prisma.order.create({
          data: {
            userId: null,
            adminId: userId,
            productId: product.id,
            status: orderStatus,
            total: total,
          },
        });
      } else {
        order = await prisma.order.create({
          data: {
            userId,
            adminId: null,
            productId: product.id,
            status: orderStatus,
            total: total,
          },
        });
      }

      await prisma.orderHistory.create({
        data: {
          userId: order.userId,
          adminId: order.adminId,
          productId: order.productId,
          status: orderStatus,
          total: order.total,
        },
      });

      if (status === "completed") {
        await prisma.cartItem.deleteMany({
          where: { userId: isAdmin ? null : userId },
        });
      }

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
