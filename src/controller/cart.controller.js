const CartService = require('../service/cart.service');

// Realiza pagamento do carrinho
const payCartController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentMethod, transactionId } = req.body;
        const cart = await CartService.payCartService(userId, paymentMethod, transactionId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Busca carrinho do usuário autenticado
const getCartByUserController = async (req, res) => {
    try {
        const cart = await CartService.findCartByUserService(req.user.id);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCartsController = async (req, res) => {
    try {
        const carts = await CartService.findAllService();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Adiciona produto ao carrinho do usuário autenticado
const addProductToCartController = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await CartService.addProductToCartService(req.user.id, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove produto do carrinho do usuário autenticado
const removeProductFromCartController = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await CartService.removeProductFromCartService(req.user.id, productId);
        if (!cart) {
            return res.status(204).send(); // carrinho deletado
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getCartByUserController,
    getAllCartsController,
    addProductToCartController,
    removeProductFromCartController,
    payCartController,
};