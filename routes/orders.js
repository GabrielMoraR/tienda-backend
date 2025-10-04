import express from "express";
import { Order, OrderItem, Product, ProductVariant, User } from "../models/index.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// 🔹 Órdenes del usuario logueado
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            { model: Product, as: "Product" },
            { model: ProductVariant, as: "ProductVariant" },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error obteniendo órdenes:", err);
    res.status(500).json({ message: "Error obteniendo órdenes" });
  }
});

// 🔹 TODAS las órdenes (solo admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "users", // 👈 ESTE alias debe coincidir con tu asociación
          attributes: ["id", "name", "phone", "address", "email"],
        },
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            { model: Product, as: "Product" },
            { model: ProductVariant, as: "ProductVariant" },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error obteniendo todas las órdenes:", err);
    res.status(500).json({ message: "Error obteniendo todas las órdenes" });
  }
});

// PATCH /orders/:id/status
router.patch("/:id/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    if (!["pending", "paid", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Estado actualizado", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando estado" });
  }
});


export default router;
