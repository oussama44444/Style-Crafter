import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';

// Get all categories and subcategories
router.get('/', categoryController.getCategories);

// Add a new category or subcategory
router.post('/add', categoryController.addCategory);

// Delete a category or subcategory
router.delete('/:id', categoryController.deleteCategory);

export default router;
