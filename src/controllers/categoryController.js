import Category from "../models/categoryModel.js";


// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
    const { id, name, subcategories } = req.body;
    try {
        const newCategory = new Category({ id, name, subcategories });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// @desc    Update a category by ID
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
    const { name, subcategories } = req.body;
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            { id: req.params.id },
            { name, subcategories },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findOneAndDelete({ id: req.params.id });
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
