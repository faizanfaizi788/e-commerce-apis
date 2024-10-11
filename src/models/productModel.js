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
    type: [String], // Array of image URLs
    validate: [arrayLimit, 'Product cannot have more than 10 images'],
  },
  category: {
    type: String,
    enum: [
      'Vehicles', 'Cars', 'Motorcycles', 'Electronics', 'Real Estate', 
      'Furniture', 'Fashion', 'Jobs', 'Services', 'Books', 'Sports Equipment', 
      'Pets', 'Agricultural Equipment', 'Baby Products', 'Health & Medical',
      'Miscellaneous'
    ],
    required: [true, 'Product category is required'],
  },
  subCategory: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Specify GeoJSON data type
      required: true,
    },
    coordinates: {
      type: [Number], // Array for [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2; // Must have longitude and latitude
        },
        message: 'Location must have [longitude, latitude]',
      },
    },
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, { 
  timestamps: true, // Automatically handle createdAt and updatedAt
});

// Index to support geospatial queries (for finding nearest products)
productSchema.index({ location: '2dsphere' });

// Limit the number of images to 10
function arrayLimit(val) {
  return val.length <= 10;
}

const Product = mongoose.model('Product', productSchema);

export default Product;
