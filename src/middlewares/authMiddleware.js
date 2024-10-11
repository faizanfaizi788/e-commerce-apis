import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Ensure correct path to the User model

export const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains the Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];
  
      // Decode the token and get the user's ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure `JWT_SECRET` is defined in your .env file

      // Fetch the user from the database without the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
