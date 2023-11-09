import express from "express";
import {
  adminLogin,
  adminRegister,
  login,
  register,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", authenticateUser, login);
router.post("/register", register);
router.post("/admin/register", adminRegister);
router.post("/admin/login", authenticateUser, adminLogin);

export default router;
