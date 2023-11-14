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

const authenticateAdminUser = async (
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
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId; // Retrieve userId from the request
    if (userId) {
      const admin = await prisma.admin.findUnique({
        where: { id: userId },
        select: { token: true },
      });

      const token = req.header("token");
      if (admin && admin.token === token) {
        next();
      } else {
        res.status(403).json({ error: "Access denied. Not an admin." });
      }
    } else {
      res.status(400).json({ error: "Invalid user ID." });
    }
    //localstorage.setItem("token",token)
  } catch (error) {
    console.error("Error verifying admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticateAdminUser(req, res, () => {
    isAdmin(req, res, next);
  });
};
