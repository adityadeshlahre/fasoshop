import express from "express";
import {
  getAccountDetails,
  editAccountDetails,
  deleteAccount,
} from "../controllers/user.controller";
import { adminLogin, adminRegister } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();
router.get("/account", authenticateUser, getAccountDetails);
router.put("/account", authenticateUser, editAccountDetails);
router.delete("/account", authenticateUser, deleteAccount);

export default router;
