import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Product from "./Product.js";

const ProductVariant = sequelize.define("ProductVariant", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  color: { type: DataTypes.STRING(50), allowNull: false },
  size: { type: DataTypes.STRING(10), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "product_variants",
  timestamps: false,
});

Product.hasMany(ProductVariant, { foreignKey: "product_id", as: "variants" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id" });

export default ProductVariant;
