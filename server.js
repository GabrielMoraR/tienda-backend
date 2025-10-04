import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import webhookRoutes from "./routes/webhook.js";
import checkoutRoutes from "./routes/checkout.js";

const app = express();

// 🌐 CORS Config (ajusta con tu dominio)
const allowedOrigins = [
  "http://localhost:5173",           // desarrollo local
  "https://playertlax.com",          // dominio de tu frontend en producción
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 🚨 Stripe webhook — DEBE ir antes de express.json()
app.use("/api/webhook", webhookRoutes);

// Middleware
app.use(express.json());

// Archivos estáticos (si subes imágenes, etc.)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);

// Render se encarga del puerto
const PORT = process.env.PORT || 4000;

// Conectar DB y levantar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");
    app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
  } catch (e) {
    console.error("❌ Error al conectar DB:", e.message);
    process.exit(1);
  }
})();
