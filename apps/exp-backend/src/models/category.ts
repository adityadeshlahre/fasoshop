import { Product } from "../../../../prisma/generated/client";
import { z } from "zod";
import { productSchema } from "./product";

export interface CategoryModel {
  id: number;
  name: string;
  createdAt: Number;
  updatedAt: Number;
  product: Product[];
}

export const categoryModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
  products: z.array(productSchema),
});
