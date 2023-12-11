import { User, Admin, Product } from "../../../../prisma/generated/client";
import { z } from "zod";
import { userSchema } from "./user";
import { adminSchema } from "./admin";
import { productSchema } from "./product";

export interface OrderModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  total: number;
  userId?: number | null;
  user?: User | null;
  adminId?: number | null;
  admin?: Admin | null;
  productId?: number | null;
  product?: Product | null;
}

export const orderModelSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.string(),
  total: z.number(),
  userId: z.number().nullable(),
  user: z.array(userSchema).nullable(),
  adminId: z.number().nullable(),
  admin: z.array(adminSchema).nullable(),
  productId: z.number().nullable(),
  product: z.array(productSchema).nullable(),
});
