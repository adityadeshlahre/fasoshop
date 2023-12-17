import {
  User,
  Admin,
  Product,
  Order,
} from "../../../../prisma/generated/client";

export interface OrderHistoryModel {
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
  orderId?: number | null;
  order?: Order | null;
}
