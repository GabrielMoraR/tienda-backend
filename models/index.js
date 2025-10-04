// index.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import Product from "./Product.js";
import Order from "./Order.js";
import User from "./User.js";
import OrderItem from "./OrderItem.js";
import ProductVariant from "./ProductVariant.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// ------------------
// Asociaciones
// ------------------

// Order ↔ OrderItem
// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "Product" }); // ⚠️ aquí está el alias "Product"

// Variant ↔ OrderItem
ProductVariant.hasMany(OrderItem, { foreignKey: "variantId" });
OrderItem.belongsTo(ProductVariant, { foreignKey: "variantId", as: "ProductVariant" });

// User ↔ Order
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "users" });


// ------------------
// Exportar
// ------------------
export { sequelize, Product, Order, User, OrderItem, ProductVariant };
