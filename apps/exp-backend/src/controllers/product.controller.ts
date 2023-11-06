import { Request, Response } from "express";
import { Product, products } from "../models/product";

export const getProducts = (req: Request, res: Response) => {
  // Get and send all products
};

export const uploadImage = (req: Request, res: Response) => {
  // Implement image upload logic
};

export const addProduct = (req: Request, res: Response) => {
  // Implement product creation logic
};

export const updatePrice = (req: Request, res: Response) => {
  // Implement product price update logic
};

export const deleteProduct = (req: Request, res: Response) => {
  // Implement product deletion logic
};
