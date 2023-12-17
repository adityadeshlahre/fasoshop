import { z } from "zod";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  adminId: number;
}

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  category: z.string(),
});

export type TProductSchema = z.infer<typeof productSchema>;