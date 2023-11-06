import { Request, Response } from 'express';
import { User, users } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = (req: Request, res: Response) => {
  // Implement login logic here, validate user, and create a JWT token
};

export const register = (req: Request, res: Response) => {
  // Implement user registration logic here and add the user to the 'users' array
};
