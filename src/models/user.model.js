
import { DataTypes } from "@sequelize/core";

import db from "../database/db.js";


// Definición del modelo Usuario
const UserModel = db.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2, // Valor por defecto si no se proporciona
      references: {
        model: "roles", // Nombre de la tabla a la que hace referencia
        key: "id", // Columna de la tabla 'roles' a la que se hace referencia
      },
      onDelete: "CASCADE", 
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuarios", 
    timestamps: true, // Habilita createdAt y updatedAt automáticamente
  }
);


export default UserModel;

/*
const crearUsuario = async (id_rol,username, email, password) => {
  const query = {
    text: `
      INSERT INTO usuarios (id_rol, username, email, password) 
      values ($1, $2, $3, $4) RETURNING id_rol, username, email, password
    `,
    values: [id_rol, username, email, password],
  };

  const {filas} = await pool.query(query);
  return filas[0];
};

const BuscarPorEmail = async (email) => {

  const query = {
    text: `
      SELECT * FROM usuarios WHERE email = $1
    `,
    values: [email],
  };

  const {filas} = await pool.query(query);
  return filas[0];
};
*/



/*
export const UserModel = {
  crearUsuario,
  BuscarPorEmail,
};
*/