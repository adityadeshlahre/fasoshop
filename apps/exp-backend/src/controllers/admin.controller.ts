import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../../../prisma/generated/client";

const prisma = new PrismaClient();
console.log("reached here");
export const getAccountDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        token: true,
      },
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
export const editAccountDetails = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { password, ...updatedData } = req.body;
    const admin = await prisma.admin.findUnique({ where: { id: userId } });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (password) {
      bcrypt.hash(password, 10, async (err: any, hashedPassword: any) => {
        if (err)
          return res.status(500).json({ error: "Internal server error" });

        try {
          const updatedUser = await prisma.admin.update({
            where: { id: userId },
            data: { password: hashedPassword, ...updatedData },
          });
          res.json(updatedUser);
        } catch (updateError) {
          console.error("Error updating account:", updateError);
          res.status(500).json({ error: "Internal server error" });
        }
      });
    } else {
      try {
        const updatedUser = await prisma.admin.update({
          where: { id: userId },
          data: updatedData,
        });
        res.json(updatedUser);
      } catch (updateError) {
        console.error("Error updating account:", updateError);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } catch (error) {
    console.error("Error editing account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const existingUser = await prisma.admin.findUnique({
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

process.on("SIGINT", async () => {
  await prisma.$disconnect();
});
