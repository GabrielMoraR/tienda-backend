import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import OrderItem from "./OrderItem.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, {
  tableName: "orders",
  timestamps: true,
});

// Relación con OrderItem


export default Order;
