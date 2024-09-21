import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images?: string;  // Optional field for the image URL
}

const productSchema: Schema = new Schema({
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

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
