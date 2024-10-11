import { DataTypes } from "@sequelize/core";
import db from "../database/db.js";

// Definición del modelo Rol
const RoleModel = db.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "roles", // Nombre de la tabla en la base de datos
    timestamps: false, // No necesitamos createdAt/updatedAt para esta tabla
  }
);

export default RoleModel;
