import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.TEXT("long"), allowNull: true },
  category: { type: DataTypes.STRING(50), allowNull: true },     // dama, caballero, etc.
  subcategory: { type: DataTypes.STRING(50), allowNull: true }, // playera, camiseta, etc.
}, {
  tableName: "products",
  timestamps: false,
});

export default Product;


