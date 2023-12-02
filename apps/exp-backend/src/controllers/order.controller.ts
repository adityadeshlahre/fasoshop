//need fix
//null values fix
//product values fetching using productId
//orderIs not being used as queue

import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { fetchProductsForSpecific } from "../lib/fetchProduct";

export const directOrder = async (req: Request, res: Response) => {
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

    const orderStatus = req.body.status === "1" ? "completed" : "pending";
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

    await prisma.orderHistory.create({
      data: {
        userId: order.userId,
        adminId: order.adminId,
        productId: order.productId,
        status: orderStatus,
        total: order.total,
      },
    });

    if (orderStatus === "completed") {
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

      if (orderStatus === "completed") {
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
  //needs fix [productId,orderId,userId] all the inputes and
  // put/changes should only work when isAdmin is true
  try {
    const userId: number | undefined = req.userId;
    const isAdmin: boolean = req.isAdmin || false;
    const orderId: number | undefined = parseInt(req.params.orderId as string);

    if (userId === undefined) {
      return res
        .status(400)
        .json({ error: "Invalid request, userId is missing" });
    }
    const { productId, status } = req.body;
    const orderStatus = status === "1" ? "completed" : "pending";

    if (productId && status) {
      // only admins should do the changes
      const order = await prisma.order.update({
        where: { id: orderId, productId: productId }, // Adjust this based on your data model
        data: {
          status: orderStatus,
        },
      });

      await prisma.orderHistory.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
        },
      });

      if (orderStatus === "completed") {
        await prisma.cartItem.deleteMany({
          where: { userId: isAdmin ? null : userId },
        });
      }
      //when pending changes to complete then cartItem should get empty too

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
