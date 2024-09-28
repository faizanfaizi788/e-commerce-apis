import express from 'express';  
import dotenv from 'dotenv';  
import connectDB from './config/db.js'; // Make sure this matches your file extension  
import authRoutes from './routes/authRoutes.js'; // Adjust if needed  
import productRoutes from './routes/productRoutes.js'; // Adjust if needed  
import cors from 'cors';  
import { v2 as cloudinary } from 'cloudinary';  

dotenv.config();  
cloudinary.config({  
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET,  
});  

connectDB(); // Initialize your database connection here  

const app = express();  
app.use(cors());  
app.use(express.json());  

// Routes  
app.use('/api/auth', authRoutes);  
app.use('/api/products', productRoutes);  

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`);  
});