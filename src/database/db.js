import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";

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