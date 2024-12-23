import db from "../database/db.js";
import { DataTypes } from "@sequelize/core";

import PacienteModel from "./pacients.model.js";

const PrediccionModel = db.define(
  "predicciones",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    fecha_prediccion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    imc: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    glucosa: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    insulina: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    puntaje_riesgo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    embarazos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    grosor_de_piel: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    presion_arterial: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fecha_de_nacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "predicciones",
    timestamps: false, // Deshabilitamos timestamps
  }
);


export default PrediccionModel;
