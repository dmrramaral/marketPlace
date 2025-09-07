const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');


// Rota para buscar o carrinho do usuário autenticado
router.get('/cart', authMiddleware, cartController.getCartByUserController);

// Rota para buscar todos os carrinhos (admin)
router.get('/carts', authMiddleware, cartController.getAllCartsController);

// Rota para adicionar produto ao carrinho do usuário autenticado
router.post('/cart/products', authMiddleware, cartController.addProductToCartController);

// Rota para remover produto do carrinho do usuário autenticado
router.delete('/cart/products', authMiddleware, cartController.removeProductFromCartController);
// Pagamento do carrinho

router.post('/pay', authMiddleware, cartController.payCartController);

module.exports = router;