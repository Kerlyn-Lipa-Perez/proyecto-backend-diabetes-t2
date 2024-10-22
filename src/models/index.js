import db from "../database/db.js";
import UserModel from "./user.model.js";
import RoleModel from "./rol.model.js";
import PacienteModel from "./pacients.model.js";
import PrediccionModel from "./prediction.model.js";

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

// Establecer la relación de 1:N entre Paciente y Predicciones
PacienteModel.hasMany(PrediccionModel, {
  foreignKey: 'id_paciente',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

PrediccionModel.belongsTo(PacienteModel, {
  foreignKey: 'id_paciente',
});


// Asociación entre Usuario y Rol
UserModel.belongsTo(RoleModel, { foreignKey: "id_rol" });
RoleModel.hasMany(UserModel, { foreignKey: "id_rol" });

// Asociación entre Usuario y Paciente
UserModel.hasMany(PacienteModel, { foreignKey: "id_usuario" });
PacienteModel.belongsTo(UserModel, { foreignKey: "id_usuario" });

// Asociación entre Paciente y Predicciones
PacienteModel.hasMany(PrediccionModel, { foreignKey: "id_paciente" });
PrediccionModel.belongsTo(PacienteModel, { foreignKey: "id_paciente" });

// Asociación entre Usuario y Predicciones (para el campo creado_por)
UserModel.hasMany(PrediccionModel, { foreignKey: "creado_por" });
PrediccionModel.belongsTo(UserModel, { foreignKey: "creado_por" });

// Sincronizar los modelos con la base de datos
db.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch(error => {
    console.error('Error al sincronizar los modelos:', error);
  });

// Exportar los modelos y la conexión a la base de datos
export { db, UserModel, RoleModel, PacienteModel };
