import { Product, Admin, User } from "../../../../prisma/generated/client";
import { z } from "zod";
import { userSchema } from "./user";
import { adminSchema } from "./admin";
import { productSchema } from "./product";

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
  id: z.number(),
  quantity: z.number(),
  productId: z.number(),
  product: z.array(productSchema),
  adminId: z.number().nullable(),
  admin: z.array(adminSchema).nullable(),
  userId: z.number().nullable(),
  user: z.array(userSchema).nullable(),
});
