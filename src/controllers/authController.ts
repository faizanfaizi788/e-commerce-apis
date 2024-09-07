import { Request, Response } from 'express';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import { ERROR_MESSAGES } from '../constant/constants';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: ERROR_MESSAGES.USER_ALREADY_EXISTS });
      return;
    }

    const user = await User.create({ name, email, password });
    if (!user) {
      res.status(400).json({ message: ERROR_MESSAGES.INVALID_USER_DATA });
      return;
    }

    res.status(201).json({
      _id: user._id, // Ensure _id is a string
      name: user.name,
      email: user.email,
      token: generateToken(user._id as string), // Ensure _id is a string
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: ERROR_MESSAGES.VALIDATION_ERROR, details: error.message });
    } else {
      console.error('Error during signup:', error);
      res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        res.status(401).json({ message: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD });
        return;
      }
  
      res.json({
        _id: user._id, // Ensure _id is a string
        name: user.name,
        email: user.email,
        token: generateToken(user._id as string), // Ensure _id is a string
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };