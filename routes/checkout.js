// routes/checkout.js
import express from "express";
import Stripe from "stripe";
import { Order, OrderItem } from "../models/index.js";   // 👈 importa OrderItem
import ProductVariant from "../models/ProductVariant.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", verifyToken, async (req, res) => {
  const { cart } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Por favor, inicia sesión para continuar con el pago" });
    }

    // ✅ Validar stock
    for (const item of cart) {
      const variant = await ProductVariant.findByPk(item.variantId, {
        include: { model: Product },
      });

      if (!variant) {
        return res.status(400).json({ error: `La variante con ID ${item.variantId} no existe` });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para ${variant.Product.name} (${variant.color} - ${variant.size})`
        });
      }
    }

    // ✅ Preparar line_items para Stripe
    const line_items = cart.map((i) => ({
      price_data: {
        currency: "mxn",
        product_data: {
          name: `${i.name} (${i.color} - ${i.size})`,
        },
        unit_amount: Math.round(Number(i.price) * 100),
      },
      quantity: i.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: { userId: String(userId) },
    });

    // ✅ Guardar orden pendiente
    const newOrder = await Order.create({
      userId,
      total: cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
      status: "pending",
      stripeSessionId: session.id,
    });

    // ✅ Guardar los ítems en la tabla order_items
    await OrderItem.bulkCreate(
      cart.map((i) => ({
        orderId: newOrder.id,          // 👈 FK a la orden
        productId: i.productId,        // 👈 FK al producto
        variantId: i.variantId,        // 👈 FK a la variante
        quantity: i.quantity,
        price: i.price,
      }))
    );

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error en checkout:", err.message);
    res.status(500).json({ error: err.message || "Error creando sesión de Stripe" });
  }
});

export default router;
