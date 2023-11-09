import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
declare module "express" {
  interface Request {
    userId?: number;
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
    const decoded = jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        console.error("token error");
      } else {
        console.log("Decoded Token:", decoded);
        req.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
