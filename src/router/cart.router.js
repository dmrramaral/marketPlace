const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operações de carrinho de compras
 */

/**
 * @swagger
 * /api/cart/cart:
 *   get:
 *     summary: Buscar carrinho do usuário autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho do usuário
 *       404:
 *         description: Carrinho não encontrado
 */
// Rota para buscar o carrinho do usuário autenticado
router.get('/cart', authMiddleware, cartController.getCartByUserController);

/**
 * @swagger
 * /api/cart/carts:
 *   get:
 *     summary: Buscar todos os carrinhos (admin)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carrinhos
 */
// Rota para buscar todos os carrinhos (admin)
router.get('/carts', authMiddleware, cartController.getAllCartsController);

/**
 * @swagger
 * /api/cart/carts/products:
 *   post:
 *     summary: Adicionar produtos ao carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Produtos adicionados ao carrinho
 *       400:
 *         description: Erro ao adicionar produtos
 */
// Rota para adicionar produto ao carrinho do usuário autenticado
router.post('/carts/products', authMiddleware, cartController.addProductToCartController);

/**
 * @swagger
 * /api/cart/carts/products:
 *   delete:
 *     summary: Remover produto do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto removido do carrinho
 *       204:
 *         description: Carrinho deletado
 *       400:
 *         description: Erro ao remover produto
 */
// Rota para remover produto do carrinho do usuário autenticado
router.delete('/carts/products', authMiddleware, cartController.removeProductFromCartController);

/**
 * @swagger
 * /api/cart/pay:
 *   post:
 *     summary: Realizar pagamento do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pagamento realizado
 *       400:
 *         description: Erro no pagamento
 */
// Pagamento do carrinho
router.post('/pay', authMiddleware, cartController.payCartController);

module.exports = router;