import { ERROR_MESSAGES } from '../constant/constants.js';
import Product from '../models/productModel.js';

// @desc    Create a new product  
// @route   POST /api/products  
// @access  Private  
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      description, 
      category, 
      subCategory, 
      condition,
      phone, 
      email, 
      images 
    } = req.body;

    console.log("createProduct : req.body", req.body);
    const location = JSON.parse(req.body.location);
    // Validate required fields
    if (!name || !price || !description || !category || !condition || !location || !phone || !email || !images) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate location format
    if (!Array.isArray(location) || location.length !== 2) {
      return res.status(400).json({ message: ERROR_MESSAGES.INVALID_LOCATION });
    }

    // Create product
    const product = await Product.create({
      name,
      price,
      description,
      category,
      subCategory,
      condition,
      location: {
        type: 'Point',
        coordinates: location,  // Expected format: [longitude, latitude]
      },
      phone,
      email,
      images,
      postedBy: req.user._id,
      isAvailable: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

// @desc    Update a product by ID  
// @route   PUT /api/products/:id  
// @access  Private  
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      price, 
      description, 
      category, 
      subCategory, 
      condition, 
      location, 
      phone, 
      email, 
      images 
    } = req.body;

    // Prepare update data
    const updateData = { 
      name, 
      price, 
      description, 
      category, 
      subCategory, 
      condition, 
      phone, 
      email,
      images: images && images.length ? images : undefined, // Only update if provided
    };

    // Validate location if provided
    if (location) {
      if (!Array.isArray(location) || location.length !== 2) {
        return res.status(400).json({ message: ERROR_MESSAGES.INVALID_LOCATION });
      }
      updateData.location = { type: 'Point', coordinates: location };
    }

    // Update product in MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

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
export const deleteProduct = async (req, res) => {  
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
export const getAllProducts = async (req, res) => {  
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
export const getProductById = async (req, res) => {  
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
