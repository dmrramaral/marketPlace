const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const orderController = require('../controller/order.controller');

// Criar pedido a partir do carrinho
router.post('/from-cart', authMiddleware, orderController.createOrderFromCartController);

// Listar pedidos do usuário
router.get('/my', authMiddleware, orderController.getMyOrdersController);

// Detalhe de um pedido do usuário
router.get('/my/:id', authMiddleware, orderController.getMyOrderByIdController);

// Admin: Buscar todos os pedidos
router.get('/all', authMiddleware, orderController.getAllOrdersController);

// Admin: Atualizar status do pedido
router.put('/:id/status', authMiddleware, orderController.updateOrderStatusController);

// Admin: Deletar pedido
router.delete('/:id', authMiddleware, orderController.deleteOrderController);

module.exports = router;