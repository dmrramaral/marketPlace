const orderService = require('../service/order.service');

const createOrderFromCartController = async (req, res) => {
  try {
    const order = await orderService.createOrderFromCartService(req.user.id, req.body || {});
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMyOrdersController = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUserService(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMyOrderByIdController = async (req, res) => {
  try {
    const order = await orderService.getOrderByIdService(req.user.id, req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Admin: Buscar todos os pedidos
const getAllOrdersController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const orders = await orderService.getAllOrdersService(parseInt(page), parseInt(limit));
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Atualizar status do pedido
const updateOrderStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatusService(req.params.id, status);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Deletar pedido
const deleteOrderController = async (req, res) => {
  try {
    await orderService.deleteOrderService(req.params.id);
    res.status(200).json({ message: 'Pedido excluído com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { 
  createOrderFromCartController, 
  getMyOrdersController, 
  getMyOrderByIdController,
  getAllOrdersController,
  updateOrderStatusController,
  deleteOrderController
};