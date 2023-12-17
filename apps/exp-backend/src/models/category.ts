import { Product } from "../../../../prisma/generated/client";
import { z } from "zod";

export interface CategoryModel {
  id: number;
  name: string;
  createdAt: Number;
  updatedAt: Number;
  product: Product[];
}

export const categoryModelSchema = z.object({
  name: z.string(),
});

export type TCategoryModelType = z.infer<typeof categoryModelSchema>;
