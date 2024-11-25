import db from "../database/db.js";
import UserModel from "./user.model.js";
import RoleModel from "./rol.model.js";
import PacienteModel from "./pacients.model.js";
import PrediccionModel from "./prediction.model.js";

// Asociación entre Usuario y Rol
UserModel.belongsTo(RoleModel, {
  foreignKey: {
    name: "id_rol",
    allowNull: false,
  },
  as: "rol",
});

RoleModel.hasMany(UserModel, {
  foreignKey: {
    name: "id_rol",
    allowNull: false,
  },
  as: "usuarios",
});

// Asociación entre Usuario y Paciente
UserModel.hasMany(PacienteModel, {
  foreignKey: {
    name: "id_usuario",
    allowNull: false,
  },
  as: "pacientes",
});

PacienteModel.belongsTo(UserModel, {
  foreignKey: {
    name: "id_usuario",
    allowNull: false,
  },
  as: "usuario",
});

// Asociación entre Paciente y Predicciones
PacienteModel.hasMany(PrediccionModel, {
  foreignKey: {
    name: "id_paciente",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  as: "predicciones",
});

PrediccionModel.belongsTo(PacienteModel, {
  foreignKey: {
    name: "id_paciente",
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  as: "paciente",
});

// Asociación entre Usuario y Predicciones (para el campo creado_por)
UserModel.hasMany(PrediccionModel, {
  foreignKey: {
    name: "creado_por",
    allowNull: false,
  },
  as: "prediccionesCreadas",
});

PrediccionModel.belongsTo(UserModel, {
  foreignKey: {
    name: "creado_por",
    allowNull: false,
  },
  as: "creador",
});


// Exportar los modelos y la conexión a la base de datos
export { db, UserModel, RoleModel, PacienteModel, PrediccionModel };
