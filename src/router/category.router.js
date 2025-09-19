const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {validaIdParam} = require('../middleware/validation.middleware');



/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operações de categorias
 */

/**
 * @swagger
 * /category/categories/create:
 *   post:
 *     summary: Criar uma nova categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Erro na criação
 */

router.post('/categories/create',authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /category/categories:
 *   get:
 *     summary: Buscar todas as categorias
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *       500:
 *         description: Erro ao buscar categorias
 */
router.get('/categories', categoryController.getAllCategories);

/**
 * @swagger
 * /category/categories/{id}:
 *   get:
 *     summary: Buscar uma categoria por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/categories/:id', validaIdParam, categoryController.getCategoryById);

/**
 * @swagger
 * /category/categories/{id}:
 *   put:
 *     summary: Atualizar uma categoria por ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       400:
 *         description: Erro na atualização
 *       404:
 *          description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
// Rota para atualizar uma categoria por ID
router.put('/categories/:id',authMiddleware, validaIdParam, categoryController.updateCategory);

/**
 * @swagger
 * /category/categories/{id}:
 *   delete:
 *     summary: Deletar uma categoria por ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria deletada
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/categories/:id',authMiddleware, validaIdParam, categoryController.deleteCategory);

module.exports = router;    