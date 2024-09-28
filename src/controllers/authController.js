import User from '../models/userModel.js'; // Ensure correct path and .js extension  
import generateToken from '../utils/generateToken.js'; // Ensure correct path and .js extension  
import { ERROR_MESSAGES } from '../constant/constants.js'; // Ensure correct path and .js extension  

// @desc    Register a new user  
// @route   POST /api/auth/signup  
// @access  Public  
export const signupUser = async (req, res) => {  
  const { name, email, password } = req.body;  

  try {  
    // Check if the user already exists  
    const userExists = await User.findOne({ email });  
    if (userExists) {  
      return res.status(400).json({ message: ERROR_MESSAGES.USER_ALREADY_EXISTS });  
    }  

    // Create a new user  
    const user = await User.create({ name, email, password });  
    if (!user) {  
      return res.status(400).json({ message: ERROR_MESSAGES.INVALID_USER_DATA });  
    }  

    // Respond with the user data and token  
    res.status(201).json({  
      _id: user._id.toString(),  
      name: user.name,  
      email: user.email,  
      token: generateToken(user._id.toString()),  
    });  
  } catch (error) {  
    // Handle validation errors  
    if (error.name === 'ValidationError') {  
      return res.status(400).json({ message: ERROR_MESSAGES.VALIDATION_ERROR, details: error.message });  
    }   
    // Log other errors and return server error response   
    console.error('Error during signup:', error);  
    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });  
  }  
};  

// @desc    Auth user & get token  
// @route   POST /api/auth/login  
// @access  Public  
export const loginUser = async (req, res) => {  
  const { email, password } = req.body;  

  try {  
    // Find the user by email  
    const user = await User.findOne({ email });  
    // Validate user and password match  
    if (!user || !(await user.matchPassword(password))) {  
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD });  
    }  

    // Respond with user data and token  
    res.json({  
      _id: user._id.toString(),  
      name: user.name,  
      email: user.email,  
      token: generateToken(user._id.toString()),  
    });  
  } catch (error) {  
    // Log errors and respond with server error  
    console.error('Error during login:', error);  
    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });  
  }  
};