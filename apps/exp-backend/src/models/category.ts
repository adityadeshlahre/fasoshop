import { Product } from "../../../../prisma/generated/client";

export interface CategoryModel {
  id: string;
  name: string;
  createdAt: Number;
  updatedAt: Number;
  product: Product[];
}
