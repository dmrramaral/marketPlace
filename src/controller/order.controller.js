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

module.exports = { createOrderFromCartController, getMyOrdersController, getMyOrderByIdController };