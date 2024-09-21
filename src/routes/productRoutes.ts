import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from '../controllers/productController';
import upload from '../middlewares/uploadMiddleware';

const router = express.Router();

// Route for handling file upload with multer during product creation
router.post('/', upload.single('image'), createProduct);

// Route to update an existing product, allowing a single image upload
router.put('/:id', upload.single('image'), updateProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

// Route to fetch all products
router.get('/', getAllProducts);

// Route to fetch a product by ID
router.get('/:id', getProductById);

export default router;
