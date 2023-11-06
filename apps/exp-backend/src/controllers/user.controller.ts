import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get user account details
export const getAccountDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request

    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Select only the necessary fields
      select: { id: true, username: true /* other fields */ },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit user account details
export const editAccountDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request
    const updatedData = req.body; // Data to update (e.g., username, email, etc.)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error editing account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user account
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send(); // Respond with a 204 status (No Content) upon successful deletion
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Make sure to disconnect the Prisma client when the server shuts down
process.on("SIGINT", () => {
  prisma.$disconnect();
});
