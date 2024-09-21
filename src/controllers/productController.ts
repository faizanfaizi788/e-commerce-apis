import { Request, Response } from 'express';
import Product from '../models/productModel';
import { ERROR_MESSAGES } from '../constant/constants';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;

    console.log("createProduct : req.body", req.body);
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload image to Cloudinary
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse); // Explicitly type the result
        }
      );

      // Ensure req.file is defined before calling uploadStream.end
      if (req.file && req.file.buffer) {
        uploadStream.end(req.file.buffer);
      } else {
        return reject(new Error('File buffer is missing'));
      }
    });

    // Apply transformations to the Cloudinary image URL (width and height of 500)
    const optimizedImageUrl = cloudinary.url(result.public_id, {
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });

    // Create product in MongoDB
    const product = await Product.create({
      name,
      price,
      description,
      images: optimizedImageUrl, // Storing the optimized Cloudinary image URL
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product by ID
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    let updatedImageUrl;

    // Check if there is a new image uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
          }
        );
        if (req.file && req.file.buffer) {
          uploadStream.end(req.file.buffer);
        } else {
          return reject(new Error('File buffer is missing'));
        }
      });

      // Apply transformations to the Cloudinary image URL (width and height of 500)
      updatedImageUrl = cloudinary.url(result.public_id, {
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
    }

    // Update product details in MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        images: updatedImageUrl ? updatedImageUrl : undefined, // If image is updated, set it; otherwise, keep the previous one
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
