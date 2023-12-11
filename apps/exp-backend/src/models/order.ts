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
  status: z.string(),
});
