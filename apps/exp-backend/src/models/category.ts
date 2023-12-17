import { Product } from "../../../../prisma/generated/client";

export interface CategoryModel {
  id: number;
  name: string;
  createdAt: Number;
  updatedAt: Number;
  product: Product[];
}

