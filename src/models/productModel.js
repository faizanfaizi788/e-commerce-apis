import mongoose from 'mongoose';  

const { Schema } = mongoose;  

// Define the product schema  
const productSchema = new Schema({  
  name: {  
    type: String,  
    required: [true, 'Product name is required'],  
  },  
  description: {  
    type: String,  
    required: [true, 'Product description is required'],  
  },  
  price: {  
    type: Number,  
    required: [true, 'Product price is required'],  
  },  
  images: {  
    type: String,  // URL of the image  
  },  
}, {  
  timestamps: true,  
});  

// Create the Product model  
const Product = mongoose.model('Product', productSchema);  

// Export the Product model  
export default Product;