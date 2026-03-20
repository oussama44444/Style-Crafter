import Category from '../models/categoryModel.js';

// Get all categories and subcategories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a new category or subcategory
export const addCategory = async (req, res) => {
  const { name, subCategory } = req.body;
  try {
    if (subCategory) {
      // Add subcategory to existing category
      const category = await Category.findOne({ name });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      if (category.subCategories.includes(subCategory)) {
        return res.status(400).json({ success: false, message: 'Subcategory already exists' });
      }
      category.subCategories.push(subCategory);
      await category.save();
      return res.json({ success: true, message: 'Subcategory added', category });
    } else {
      // Add new category
      const exists = await Category.findOne({ name });
      if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });
      const category = new Category({ name, subCategories: [] });
      await category.save();
      return res.json({ success: true, message: 'Category added', category });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a category or subcategory
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { subCategory } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    if (subCategory) {
      // Remove subcategory
      category.subCategories = category.subCategories.filter(sub => sub !== subCategory);
      await category.save();
      return res.json({ success: true, message: 'Subcategory deleted', category });
    } else {
      // Remove entire category
      await Category.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
