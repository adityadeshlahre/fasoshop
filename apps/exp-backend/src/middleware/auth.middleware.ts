import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "../../../../prisma/generated/client";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

declare module "express" {
  interface Request {
    userId?: number;
    isAdmin?: boolean;
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not defined" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.userId = decoded.id;
    const admin = await prisma.admin.findUnique({
      where: { id: req.userId },
      select: { token: true },
    });

    if (admin && admin.token === token) {
      req.isAdmin = true;
    }

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
