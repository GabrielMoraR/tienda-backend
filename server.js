import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import webhookRoutes from "./routes/webhook.js"; // 👈 Importa tu webhook
import checkoutRoutes from "./routes/checkout.js"; // 👈 cambiado a import

const app = express();

// 🚨 Esta ruta debe ir ANTES de express.json()
app.use("/api/webhook", webhookRoutes);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);


const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    // Si tus tablas ya existen, NO sincronices con force.
    // await sequelize.sync({ alter: true }); // opcional si necesitas ajustar columnas
    console.log("DB conectada");
    app.listen(PORT, () => console.log(`API escuchando en ${PORT}`));
  } catch (e) {
    console.error("Error al conectar DB:", e.message);
    process.exit(1);
  }
})();
