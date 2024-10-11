import db from "../database/db.js";
import UserModel from "./user.model.js";
import RoleModel from "./rol.model.js";
import PacienteModel from "./pacients.model.js";

// Definir asociaciones
UserModel.belongsTo(RoleModel, { foreignKey: "id_rol" });
RoleModel.hasMany(UserModel, { foreignKey: "id_rol" });

// Definir la relación uno a muchos entre Usuario y Paciente
UserModel.hasMany(PacienteModel, {
  foreignKey: "id_usuario",
  sourceKey: "id",
});

PacienteModel.belongsTo(UserModel, {
  foreignKey: "id_usuario",
  targetKey: "id",
});

// Exportar los modelos y la conexión a la base de datos
export { db, UserModel, RoleModel, PacienteModel };
