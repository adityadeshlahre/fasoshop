import { z } from "zod";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string;
}

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(7),
  email: z.string().email(),
  password: z.string().min(6).max(12),
  token: z.string(),
});
