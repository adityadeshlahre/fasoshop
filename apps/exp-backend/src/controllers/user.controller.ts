import { Request, Response } from "express";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();

export const getAccountDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, token: true },
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

export const editAccountDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const updatedData = req.body;
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

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(204).send({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
process.on("SIGINT", () => {
  prisma.$disconnect();
});
