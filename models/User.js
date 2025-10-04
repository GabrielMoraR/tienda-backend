import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(200), allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },     // obligatorio
  address: { type: DataTypes.STRING, allowNull: false },   // obligatorio
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
}, {
  tableName: "users",
  timestamps: false,
});

export default User;
