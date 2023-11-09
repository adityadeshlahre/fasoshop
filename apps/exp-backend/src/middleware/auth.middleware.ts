import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "../../../../prisma/generated/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = prisma.user.token || prisma.admin.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not defined" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        console.error("token error");
      } else {
        console.log("Decoded Token:", decoded);
        next();
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
