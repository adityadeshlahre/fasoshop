import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) {
        console.log("Error comparing passwords");
        return res.status(500).json({ error: "Internal server error" });
      }

      if (passwordMatch) {
        // Passwords match, generate a JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "1h",
        });

        res.json({ token });
      } else {
        // Passwords do not match
        console.log("Password did not match!");
        res.status(401).json({ error: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not defined" });
    }

    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash the password with bcrypt
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log("Password hash error", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Create a new user and store it in the database
      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword, // Use the hashed password
        },
      });

      res.json({ newUser, message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Make sure to disconnect the Prisma client when the server shuts down
process.on("SIGINT", () => {
  prisma.$disconnect();
});
