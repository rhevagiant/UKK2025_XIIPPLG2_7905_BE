const express = require('express');
const router = express.Router();
const categoryController = require('../../Controller/category/categoryController');

router.post('/add', categoryController.createCategory);

module.exports = router;