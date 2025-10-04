// routes/webhook.js
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { Order } from "../models/index.js";
import ProductVariant from "../models/ProductVariant.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe necesita el raw body para validar la firma
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Error validando webhook:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Buscar orden por stripeSessionId
        const order = await Order.findOne({
          where: { stripeSessionId: session.id },
        });

        if (!order) {
          console.error("⚠️ Orden no encontrada para sesión:", session.id);
          return res.status(404).send("Orden no encontrada");
        }

        // Extraer carrito desde metadata
        const cart = JSON.parse(session.metadata.cart);

        // Restar stock de cada variante
        for (const item of cart) {
          const variant = await ProductVariant.findByPk(item.variantId);

          if (variant) {
            const newStock = variant.stock - item.quantity;
            await variant.update({ stock: newStock >= 0 ? newStock : 0 });
          } else {
            console.error(`⚠️ Variante ${item.variantId} no encontrada`);
          }
        }

        // Actualizar estado de la orden
        await order.update({ status: "paid" });

        console.log(`✅ Orden ${order.id} pagada y stock actualizado`);
      } catch (err) {
        console.error("❌ Error procesando webhook:", err);
        return res.status(500).send("Error en webhook");
      }
    }

    res.json({ received: true });
  }
);

export default router;
