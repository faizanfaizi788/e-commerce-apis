import express from 'express';  
import dotenv from 'dotenv';  
import connectDB from './config/db.js'; // Make sure this matches your file extension  
import authRoutes from './routes/authRoutes.js'; // Adjust if needed  
import productRoutes from './routes/productRoutes.js'; // Adjust if needed  
import categoryRoutes from './routes/categoryRoutes.js';
import cors from 'cors';  

dotenv.config();  

connectDB(); // Initialize your database connection here  

const app = express();  
app.use(cors());  
app.use(express.json());  

// Routes  
app.use('/api/auth', authRoutes);  
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);  

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});