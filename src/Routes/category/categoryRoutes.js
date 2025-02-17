const express = require('express');
const router = express.Router();
const categoryController = require('../../Controller/category/categoryController');

router.post('/add', categoryController.createCategory);
router.get('/all', categoryController.getAllCategories);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
module.exports = router;