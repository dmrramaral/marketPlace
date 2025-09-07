const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {validaIdParam} = require('../middleware/validation.middleware');

// Rota para criar uma categoria
router.post('/categories/create',authMiddleware, categoryController.createCategory);

// Rota para buscar todas as categorias
router.get('/categories', categoryController.getAllCategories);

// Rota para buscar uma categoria por ID
router.get('/categories/:id', validaIdParam, categoryController.getCategoryById);

// Rota para atualizar uma categoria por ID
router.put('/categories/:id',authMiddleware, validaIdParam, categoryController.updateCategory);

// Rota para deletar uma categoria por ID
router.delete('/categories/:id',authMiddleware, validaIdParam, categoryController.deleteCategory);

module.exports = router;    