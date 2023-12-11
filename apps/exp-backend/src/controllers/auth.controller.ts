import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { userLoginSchema, userSchema } from "../models/user";
import { adminLoginSchema, adminSchema } from "../models/admin";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id: number) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, JWT_SECRET);
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData = userSchema.safeParse(req.body);
    if (!userData.success) {
      res.status(411).json({
        error: userData.error,
      });
      return;
    }
    const { username, email, password } = userData.data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log("Password hash error", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      res.json({ newUser, message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userData = userLoginSchema.safeParse(req.body);
    if (!userData.success) {
      res.status(411).json({
        error: userData.error,
      });
      return;
    }
    const { email, password } = userData.data;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    bcrypt.compare(password, user.password, async (err, passwordMatch) => {
      if (err) {
        console.log("Error comparing passwords");
        return res.status(500).json({ error: "Internal server error" });
      }
      if (passwordMatch) {
        const token = generateToken(user.id);
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { token: token },
          });
          res.json({ token });
          // localStorage.setItem("token", token);
        } catch (updateError) {
          console.error("Error updating token:", updateError);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        console.log("Password did not match!");
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const adminData = adminSchema.safeParse(req.body);
    if (!adminData.success) {
      res.status(411).json({
        error: adminData.error,
      });
      return;
    }
    const { username, email, password } = adminData.data;
    const existingAdminUser = await prisma.admin.findUnique({
      where: { email },
    });
    if (existingAdminUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log("Password hash error", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const newAdmin = await prisma.admin.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      res.json({ newAdmin, message: "Admin registered successfully" });
    });
  } catch (error) {
    console.error("Error during admin registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const adminData = adminLoginSchema.safeParse(req.body);
    if (!adminData.success) {
      res.status(411).json({
        error: adminData.error,
      });
      return;
    }
    const { email, password } = adminData.data;
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    bcrypt.compare(password, admin.password, async (err, passwordMatch) => {
      if (err) {
        console.log("Error comparing passwords");
        return res.status(500).json({ error: "Internal server error" });
      }
      if (passwordMatch) {
        const token = generateToken(admin.id);
        try {
          await prisma.admin.update({
            where: { email: admin.email },
            data: { token: token },
          });
          res.json({ token });
          // localStorage.setItem("token", token);
        } catch (updateError) {
          console.error("Error updating token:", updateError);
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        console.log("Password did not match!");
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

process.on("SIGINT", () => {
  prisma.$disconnect();
});
