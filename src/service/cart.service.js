
const Cart = require('../model/Cart');
const Product = require('../model/Product');


// Calcula o frete (exemplo: valor fixo)
function calcularFrete(cart) {
    return cart.products.length > 0 ? 20 : 0;
}

// Busca carrinho do usuário
const findCartByUserService = async (userId) => {
    return await Cart.findOne({ user: userId }).populate('products._id').populate('user');
};

const findByIdService = (id) => Cart.findById(id).populate('products._id').populate('user');

const findAllService = () => Cart.find().populate('products._id').populate('user');

// Adiciona array de produtos ao carrinho (cria se não existir)
const addProductsArrayToCartService = async (userId, productsArray) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({
            user: userId,
            products: [],
            totalPrice: 0,
            frete: 0
        });
    }
    for (const item of productsArray) {
        const { _id: productId, quantity } = item;
        const product = await Product.findById(productId);
        if (!product) throw new Error(`Product not found: ${productId}`);
        if (product.stock < quantity) throw new Error(`Insufficient stock for product: ${productId}`);
        const existingProductIndex = cart.products.findIndex(p => p._id.toString() === productId);
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ _id: productId, quantity });
        }
    }
    // Recalcula total
    cart.totalPrice = 0;
    for (const p of cart.products) {
        const prod = await Product.findById(p._id);
        cart.totalPrice += prod.price * p.quantity;
    }
    cart.frete = calcularFrete(cart);
    await cart.save();
    let populatedCart = await cart.populate('products._id');
   // populatedCart = await populatedCart.populate('user');
    return populatedCart;
};

// Remove produto do carrinho, deleta carrinho se vazio
const removeProductFromCartService = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');
    const productIndex = cart.products.findIndex(p => p._id.toString() === productId);
    if (productIndex === -1) throw new Error('Product not found in cart');
    cart.products.splice(productIndex, 1);
    // Recalcula total
    cart.totalPrice = 0;
    for (const p of cart.products) {
        const prod = await Product.findById(p._id);
        cart.totalPrice += prod.price * p.quantity;
    }
    cart.frete = calcularFrete(cart);
    if (cart.products.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return null;
    } else {
    await cart.save();
    let populatedCart = await cart.populate('products._id');
    populatedCart = await populatedCart.populate('user');
    return populatedCart;
    }
};

// Realiza pagamento do carrinho
const payCartService = async (userId, paymentMethod, transactionId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');
    if (cart.products.length === 0) throw new Error('Cart is empty');
    if (cart.paymentStatus === 'paid') throw new Error('Cart already paid');

    cart.paymentStatus = 'paid';
    cart.paymentDetails = {
        method: paymentMethod,
        paidAt: new Date(),
        transactionId: transactionId || null
    };
    await cart.save();
    let populatedCart = await cart.populate('products._id');
    populatedCart = await populatedCart.populate('user');
    return populatedCart;
};

module.exports = {
    findByIdService,
    findAllService,
    findCartByUserService,
    addProductsArrayToCartService,
    removeProductFromCartService,
    payCartService,
};