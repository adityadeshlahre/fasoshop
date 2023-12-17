import { z } from "zod";

export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string;
}

export const adminSchema = z.object({
  username: z.string().min(1).max(7),
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(12),
});

export type TAdminSchema = z.infer<typeof adminSchema>;
export type TAdminLoginSchema = z.infer<typeof adminLoginSchema>;
