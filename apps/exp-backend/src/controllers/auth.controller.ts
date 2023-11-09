import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../../../prisma/generated/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const generateToken = (id: number) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, JWT_SECRET);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

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
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) {
        console.log("Error comparing passwords");
        return res.status(500).json({ error: "Internal server error" });
      }

      if (passwordMatch) {
        const token = generateToken(user.id);
        prisma.user.update({
          where: { email: user.email },
          data: { token: token },
        });
        // localStorage.setItem("token", token);

        res.json({ token });
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
    const { username, email, password } = req.body;

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
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    bcrypt.compare(password, admin.password, (err, passwordMatch) => {
      if (err) {
        console.log("Error comparing passwords");
        return res.status(500).json({ error: "Internal server error" });
      }

      if (passwordMatch) {
        const token = generateToken(admin.id);
        prisma.admin.update({
          where: { email: admin.email },
          data: { token: token },
        });
        // localStorage.setItem("token", token);

        res.json({ token });
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
