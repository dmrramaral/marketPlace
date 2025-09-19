
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

// Adiciona array de produtos ao carrinho (cria se não existir) - otimizado em batch
const addProductsArrayToCartService = async (userId, productsArray) => {
    // Summarize requested quantities per product id
    const addedMap = productsArray.reduce((acc, it) => {
        const id = it._id?.toString ? it._id.toString() : it._id;
        const qty = Number(it.quantity) || 0;
        if (!acc[id]) acc[id] = 0;
        acc[id] += qty;
        return acc;
    }, {});

    const productIds = Object.keys(addedMap);
    if (productIds.length === 0) throw new Error('No products provided');

    // Fetch all products in batch
    const products = await Product.find({ _id: { $in: productIds } });
    const productsMap = products.reduce((m, p) => { m[p._id.toString()] = p; return m; }, {});

    // ensure all products exist
    for (const id of productIds) {
        if (!productsMap[id]) throw new Error(`Product not found: ${id}`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, products: [], totalPrice: 0, frete: 0 });
    }

    // build existing quantities map
    const existingMap = cart.products.reduce((m, p) => { m[p._id.toString()] = p.quantity; return m; }, {});

    // Validate stock and update cart quantities
    for (const id of productIds) {
        const addQty = addedMap[id] || 0;
        const existingQty = existingMap[id] || 0;
        const desiredQty = existingQty + addQty;
        const product = productsMap[id];
        if (product.stock < desiredQty) throw new Error(`Insufficient stock for product: ${id}`);

        const existingIndex = cart.products.findIndex(p => p._id.toString() === id);
        if (existingIndex >= 0) {
            cart.products[existingIndex].quantity = desiredQty;
        } else {
            cart.products.push({ _id: id, quantity: desiredQty });
        }
    }

    // Recalculate totalPrice using batch fetch of current products in cart
    const cartProductIds = cart.products.map(p => p._id.toString());
    const cartProducts = await Product.find({ _id: { $in: cartProductIds } });
    const cartProductsMap = cartProducts.reduce((m, p) => { m[p._id.toString()] = p; return m; }, {});

    cart.totalPrice = 0;
    for (const p of cart.products) {
        const prod = cartProductsMap[p._id.toString()];
        if (!prod) throw new Error(`Product data missing when calculating total: ${p._id}`);
        cart.totalPrice += prod.price * p.quantity;
    }

    cart.frete = calcularFrete(cart);
    await cart.save();
    let populatedCart = await cart.populate('products._id');
    populatedCart = await populatedCart.populate('user');
    return populatedCart;
};

// Remove produto do carrinho, deleta carrinho se vazio
const removeProductFromCartService = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');
    const productIndex = cart.products.findIndex(p => p._id.toString() === productId);
    if (productIndex === -1) throw new Error('Product not found in cart');
    cart.products.splice(productIndex, 1);
    // Recalcula total usando batch
    const cartProductIds = cart.products.map(p => p._id.toString());
    const cartProducts = await Product.find({ _id: { $in: cartProductIds } });
    const cartProductsMap = cartProducts.reduce((m, p) => { m[p._id.toString()] = p; return m; }, {});
    cart.totalPrice = 0;
    for (const p of cart.products) {
        const prod = cartProductsMap[p._id.toString()];
        if (!prod) throw new Error(`Product data missing when calculating total: ${p._id}`);
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