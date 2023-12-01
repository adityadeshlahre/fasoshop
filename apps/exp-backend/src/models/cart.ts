import { Product, Admin, User } from "../../../../prisma/generated/client";

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
