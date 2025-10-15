const Order = require('../model/Order');
const Cart = require('../model/Cart');
const Product = require('../model/Product');

async function createOrderFromCartService(userId, { paymentMethod, notes } = {}) {
  const cart = await Cart.findOne({ user: userId }).populate('products._id');
  if (!cart) throw new Error('Carrinho não encontrado');
  if (cart.products.length === 0) throw new Error('Carrinho vazio');

  // Montar itens
  const productIds = cart.products.map(p => p._id._id || p._id);
  const productsDb = await Product.find({ _id: { $in: productIds } });
  const productsMap = productsDb.reduce((m,p)=>{m[p._id.toString()]=p;return m;},{});

  let subtotal = 0;
  const items = cart.products.map(p => {
    const prod = productsMap[p._id._id?.toString() || p._id.toString()] || p._id;
    const price = prod.price;
    const quantity = p.quantity;
    const lineSubtotal = price * quantity;
    subtotal += lineSubtotal;
    return {
      product: prod._id,
      name: prod.name,
      price,
      quantity,
      subtotal: lineSubtotal
    };
  });

  const frete = cart.frete || 0;
  const total = subtotal + frete;

  const order = new Order({
    user: userId,
    items,
    subtotal,
    frete,
    total,
    paymentMethod: paymentMethod || null,
    status: 'pending',
    paymentStatus: 'pending',
    notes: notes || null,
  });
  await order.save();

  // Limpar carrinho após criação do pedido
  await Cart.findByIdAndDelete(cart._id);

  return await Order.findById(order._id).populate('items.product').populate('user');
}

async function getOrdersByUserService(userId) {
  return Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product').populate('user');
}

async function getOrderByIdService(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product').populate('user');
  if (!order) throw new Error('Pedido não encontrado');
  return order;
}

// Admin: Buscar todos os pedidos com paginação
async function getAllOrdersService(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const orders = await Order.find()
    .populate('items.product')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Order.countDocuments();
  
  return {
    orders,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalOrders: total
  };
}

// Admin: Atualizar status do pedido
async function updateOrderStatusService(orderId, status) {
  const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Status inválido');
  }

  const order = await Order.findByIdAndUpdate(
    orderId, 
    { status, updatedAt: new Date() },
    { new: true }
  ).populate('items.product').populate('user');

  if (!order) throw new Error('Pedido não encontrado');
  return order;
}

// Admin: Deletar pedido
async function deleteOrderService(orderId) {
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) throw new Error('Pedido não encontrado');
  return order;
}

module.exports = { 
  createOrderFromCartService, 
  getOrdersByUserService, 
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService,
  deleteOrderService
};