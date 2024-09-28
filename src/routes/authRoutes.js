import express from 'express';  
import { signupUser, loginUser } from '../controllers/authController.js'; // Include .js extension  

const router = express.Router();  

router.post('/signup', signupUser);  
router.post('/login', loginUser);  

export default router;