import express from 'express';  
import {  
  createProduct,  
  updateProduct,  
  deleteProduct,  
  getAllProducts,  
  getProductById,  
} from '../controllers/productController.js';  
import upload from '../middlewares/uploadMiddleware.js'; // Ensure the correct path and .js extension  
import { protect } from '../middlewares/authMiddleware.js'; // Import the authentication middleware

const router = express.Router();  

// Route for handling file upload with multer during product creation  
router.post('/', protect, upload.array('images', 10), createProduct);  // Apply `protect` middleware here

// Route to update an existing product, allowing a single image upload  
router.put('/:id', protect, upload.array('images', 10), updateProduct);  // Apply `protect` middleware here

// Route to delete a product by ID  
router.delete('/:id', protect, deleteProduct);  // Apply `protect` middleware here

// Public Routes - No authentication required
router.get('/', getAllProducts);  
router.get('/:id', getProductById);  

export default router;
