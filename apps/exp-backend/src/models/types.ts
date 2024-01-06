import { z } from "zod";

export const adminSchema = z.object({
  username: z.string().min(1).max(7),
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

export const cartItemModelSchema = z.object({
  quantity: z.number().positive(),
});

export const categoryModelSchema = z.object({
  name: z.string(),
});

export const orderModelSchema = z.object({
  status: z.string(),
});

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  category: z.string(),
});

export const userSchema = z.object({
  username: z.string().min(1).max(7),
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

export const orderHistoryModelSchema = z.object({
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
  orderId: z.number().nullable(),
  order: z.array(orderModelSchema).nullable(),
});

export type TProductSchema = z.infer<typeof productSchema>;
export type TUserSchema = z.infer<typeof userSchema>;
export type TUserLoginSchema = z.infer<typeof userLoginSchema>;
export type TCategoryModelType = z.infer<typeof categoryModelSchema>;
export type TCartItemModelSchema = z.infer<typeof cartItemModelSchema>;
export type TAdminSchema = z.infer<typeof adminSchema>;
export type TAdminLoginSchema = z.infer<typeof adminLoginSchema>;
