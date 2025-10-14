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

// Busca todos os carrinhos (admin)
const getAllCartsController = async (req, res) => {
    try {
        const carts = await CartService.findAllService();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Adiciona produtos ao carrinho do usuário autenticado (agora aceita array)
const addProductToCartController = async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Envie um array de produtos.' });
        }
        const cart = await CartService.addProductsArrayToCartService(req.user.id, products);
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

// Atualiza quantidade específica de produto no carrinho
const updateProductQuantityController = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || quantity === undefined || quantity < 0) {
            return res.status(400).json({ error: 'ProductId e quantity são obrigatórios. Quantity deve ser >= 0.' });
        }
        
        if (quantity === 0) {
            // Se quantidade for 0, remove o produto
            const cart = await CartService.removeProductFromCartService(req.user.id, productId);
            if (!cart) {
                return res.status(204).send(); // carrinho deletado
            }
            return res.status(200).json(cart);
        }
        
        const cart = await CartService.updateProductQuantityService(req.user.id, productId, quantity);
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
    updateProductQuantityController,
    payCartController,
};