//need fix
//null values fix
//product values fetching using productId
//orderIs not being used as queue
//cartItems checkingup its clearning or not

import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { fetchProductsForSpecific } from "../lib/fetchProduct";
import { orderModelSchema } from "../models/order";

export const directOrder = async (req: Request, res: Response) => {
  //this function fix need
  try {
    const userId: number | undefined = req.userId;
    const isAdmin: boolean = req.isAdmin || false;

    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }

    const productId: number | undefined = parseInt(
      req.params.productId as string
    );

    if (!productId) {
      return res.status(400).json({ error: "Invalid productId provided" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const orderData = orderModelSchema.safeParse(req.body);
    if (!orderData.success) {
      res.status(411).json({
        error: orderData.error,
      });
      return;
    }
    const { status } = orderData.data;
    const orderStatus = status === "1" ? "completed" : "pending";
    const total = product.price;

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
          userId: userId,
          adminId: null,
          productId: product.id,
          status: orderStatus,
          total: total,
        },
      });
    }

    if (orderStatus === "completed") {
      await prisma.orderHistory.create({
        data: {
          userId: order.userId,
          adminId: order.adminId,
          productId: order.productId,
          status: orderStatus,
          total: order.total,
        },
      });
      await prisma.cartItem.deleteMany({
        where: { userId: isAdmin ? null : userId },
      });
    }

    res.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal server error" });
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
    const orderData = orderModelSchema.safeParse(req.body);
    if (!orderData.success) {
      res.status(411).json({
        error: orderData.error,
      });
      return;
    }
    const { status } = orderData.data;
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

      if (orderStatus === "completed") {
        await prisma.orderHistory.create({
          data: {
            userId: order.userId,
            adminId: order.adminId,
            productId: order.productId,
            status: orderStatus,
            total: order.total,
          },
        });
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

export const orderStatusUpdate = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;
    const isAdmin: boolean = req.isAdmin || false;
    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Only admins are allowed to update order status" });
    }
    //specific Product updation need to achive
    const orderId = await prisma.order.findFirst({
      where: {
        OR: [
          { userId: userId, status: "pending" },
          { adminId: userId, status: "pending" },
        ],
      },
    });
    if (!orderId) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderData = orderModelSchema.safeParse(req.body);
    if (!orderData.success) {
      res.status(411).json({
        error: orderData.error,
      });
      return;
    }
    const { status } = orderData.data;
    const orderStatus = status === "1" ? "completed" : "pending";

    if (status && orderId) {
      await prisma.order.update({
        where: { id: orderId?.id, productId: orderId?.productId },
        data: {
          status: orderStatus,
        },
      });
    }

    if (orderStatus === "completed") {
      await prisma.orderHistory.create({
        data: {
          userId: orderId.userId,
          adminId: orderId.adminId,
          productId: orderId.productId,
          status: orderStatus,
          total: orderId.total,
        },
      });
      await prisma.cartItem.deleteMany({
        where: {
          OR: [{ userId: orderId.userId }, { adminId: orderId.adminId }],
        },
      });
    }

    res.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const orderDeletion = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;
    const isAdmin: boolean = req.isAdmin || false;
    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Only admins are allowed to update order status" });
    }
    //specific Product Deletion need to achive
    const orderId = await prisma.order.findFirst({
      where: {
        OR: [
          { userId: userId, status: "pending" },
          { adminId: userId, status: "pending" },
        ],
      },
    });

    if (orderId) {
      await prisma.order.deleteMany({
        where: { id: orderId?.id },
      });

      await prisma.orderHistory.deleteMany({
        where: { id: orderId?.id },
      });

      await prisma.cartItem.deleteMany({
        where: { OR: [{ userId: userId }, { adminId: userId }] },
      });

      res.json({ message: "Order deleted successfully" });
    } else {
      res.json({ message: "Order wans't successfully deleted" });
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

export const orderWithPendingStatus = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = req.userId;
    const isAdmin: boolean = req.isAdmin || false;

    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }

    const orderHistory = await prisma.order.findMany({
      where: {
        userId: isAdmin ? null : userId,
        adminId: isAdmin ? userId : null,
        status: "pending",
      },
    });

    res.json(orderHistory);
  } catch (error) {
    console.error("Error retrieving order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
