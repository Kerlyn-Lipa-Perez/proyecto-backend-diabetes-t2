import { pool } from "../database/connection.js";


const crearUsuario = async (username, email, password) => {
  const query = {
    text: `
      INSERT INTO usuarios (id_rol, username, email, password) 
      values ($1, $2, $3, $4) RETURNING id_rol, username, email, password
    `,
    values: [2, username, email, password],  
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





export const UserModel = {
  crearUsuario,
  BuscarPorEmail,
};