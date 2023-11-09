import express from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", authenticateUser, login);
router.post("/register", register);

export default router;
