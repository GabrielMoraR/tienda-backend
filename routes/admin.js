const express = require('express');
const router = express.Router();
const { Product, Order, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware, adminMiddleware);

// CRUD Productos
router.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post('/products', async (req, res) => {
  const { title, description, price_cents, stock } = req.body;
  const product = await Product.create({ title, description, price_cents, stock });
  res.json(product);
});

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price_cents, stock } = req.body;
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  await product.update({ title, description, price_cents, stock });
  res.json(product);
});

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  await product.destroy();
  res.json({ message: 'Producto eliminado' });
});

// Listar pedidos
router.get('/orders', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

// Listar usuarios
router.get('/users', async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
});

module.exports = router;
