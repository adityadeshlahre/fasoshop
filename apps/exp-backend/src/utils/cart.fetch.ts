//NEED FIX

import { Request, Response } from "express";
import { fetchImages } from "./image.fetch";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

export const myCart = async (req: Request, res: Response) => {
  try {
    const urls: any = await fetchImages(res, req);
    console.log(urls[5]); // Logs the URL at the specified index
    return urls[5];
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
