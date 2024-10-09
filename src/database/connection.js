
import pg from "pg";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from "../settings/environments.js";

// Establecer la conexión a la base de datos

export const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});


try {
  await pool.query("SELECT NOW()");
  console.log("Conexión establecida con la base de datos con éxito.");
  
} catch (error) {
  console.log(error);
  
}
