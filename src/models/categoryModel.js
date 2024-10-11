import mongoose from 'mongoose';

const { Schema } = mongoose;

const subcategorySchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
});

const categorySchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    subcategories: [subcategorySchema]
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
