import express from 'express';
import { getAccountDetails, editAccountDetails, deleteAccount } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/account', authMiddleware, getAccountDetails);
router.put('/account', authMiddleware, editAccountDetails);
router.delete('/account', authMiddleware, deleteAccount);

export default router;
