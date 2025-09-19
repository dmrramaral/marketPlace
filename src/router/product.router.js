const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {validProduct, validaIdParam} = require("../middleware/validation.middleware");
const paginationMiddleware = require("../middleware/pagination.middleware");

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Operações de produtos
 */

/**
 * @swagger
 * /product/products/create:
 *   post:
 *     summary: Criar um novo produto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Produto criado
 *       400:
 *         description: Erro na criação
 */
// Rota para criar um produto
router.post("/products/create", authMiddleware ,validProduct, productController.createProductController());

/**
 * @swagger
 * /product/products:
 *   get:
 *     summary: "Buscar todos os produtos"
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página da listagem
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
// Rota para buscar todos os produtos
router.get("/products", paginationMiddleware, productController.getAllProductsController());

/**
 * @swagger
 * /product/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
// Rota para buscar um produto por ID
router.get("/products/:id",validaIdParam, productController.getProductByIdController());

/**
 * @swagger
 * /product/products/{id}:
 *   put:
 *     summary: Atualizar produto por ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       400:
 *         description: Erro na atualização
 *       404:
 *         description: Produto não encontrado
 */
// Rota para atualizar um produto por ID
router.put("/products/:id", authMiddleware, validaIdParam, validProduct, productController.updateProductController());

/**
 * @swagger
 * /product/products/{id}:
 *   delete:
 *     summary: Deletar produto por ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado
 *       404:
 *         description: Produto não encontrado
 */
// Rota para deletar um produto por ID
router.delete("/products/:id", authMiddleware,validaIdParam, productController.deleteProductController());

module.exports = router;