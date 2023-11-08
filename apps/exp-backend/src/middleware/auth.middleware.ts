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
  // Get the token from the request header
  const token = req.header["token"];

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not defined" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        console.log("ewre error");
      } else {
        prisma.user.id = decoded;
      }
    });
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
