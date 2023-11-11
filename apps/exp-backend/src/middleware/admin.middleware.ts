import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "../../../../prisma/generated/client";
const prisma = new PrismaClient();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module "express" {
  interface Request {
    userId?: number;
    isAdmin?: boolean;
  }
}

export const authenticateUser = (
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
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    req.userId = decoded.id;
    req.isAdmin = isInAdminTable(); // Assuming the token has role info

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Not an admin." });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticateUser(req, res, () => {
    isAdmin(req, res, next);
  });
};

function isInAdminTable(): boolean | undefined {}
