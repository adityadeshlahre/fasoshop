import express from "express";
import {
  adminLogin,
  adminRegister,
  login,
  register,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

export default router;
