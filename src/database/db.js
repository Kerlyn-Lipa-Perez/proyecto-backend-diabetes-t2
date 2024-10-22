import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from "../settings/environments.js";

const db = new Sequelize({
  dialect:PostgresDialect,
  database:'DBdiabetes',
  user:'postgres',
  password: 'kerlyn',
  host: 'localhost',
  port: 5432,
  clientMinMessages: 'notice',

});



export default db;

