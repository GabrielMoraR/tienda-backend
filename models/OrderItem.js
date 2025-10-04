// models/OrderItem.js
import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  variantId: { type: DataTypes.INTEGER, allowNull: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, {
  tableName: "order_items",
  timestamps: true,
});


export default OrderItem;
