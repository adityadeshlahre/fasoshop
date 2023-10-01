import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Ping server is running on port ${PORT}`);
});
