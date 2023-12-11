import { Product, Admin, User } from "../../../../prisma/generated/client";
import { z } from "zod";

export interface CartItemModel {
  id: number;
  quantity: number;
  productId: number;
  product: Product;
  adminId?: number | null;
  admin?: Admin | null;
  userId?: number | null;
  user?: User | null;
}

export const cartItemModelSchema = z.object({
  quantity: z.number().positive(),
});
