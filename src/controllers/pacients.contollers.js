import  PacienteModel  from "../models/pacients.model.js";
import jwt from "jsonwebtoken";
import PrediccionModel from "../models/prediction.model.js";

// ------------- METODOS CRUD -------------//

//GET /PACIENTES
export const AllPacientesCtrl = async (_req, res) => {
  try {

    const pacientes = await PacienteModel.findAll();
    res.json(pacientes);

  } catch (error) {
    console.log(error);
    res.json({ message: "Error al obtener los pacientes." });

  }
};


//POST /PACIENTES
export const CreatePacientesCtrl = async (req, res) => {
  try {

    const usuario_e = await UserModel.findOne({
      where: {
        email: email, // Condición de búsqueda por email
      },
    });

    

    const {
      id_usuario,
      nombres,
      apellidos,
      fecha_nacimiento,
      genero,
      telefono,
      DNI,
      prediccion,
    } = req.body;

    // Crear paciente
    const nuevoPaciente = await PacienteModel.create(
      {
        id,
        id_usuario,
        nombres,
        apellidos,
        fecha_nacimiento,
        genero,
        telefono,
        DNI,
      },
      { transaction }
    );

    // Crear predicción vinculada al paciente
    const nuevaPrediccion = await PrediccionModel.create(
      {
        id_paciente: nuevoPaciente.id, // Vinculamos con el id del paciente creado
        fecha_prediccion: prediccion.fecha_prediccion,
        imc: prediccion.imc,
        glucosa: prediccion.glucosa,
        insulina: prediccion.insulina,
        puntaje_riesgo: prediccion.puntaje_riesgo,
        fecha_creacion: prediccion.fecha_creacion,
        creado_por: prediccion.creado_por,
        embarazos: prediccion.embarazos,
        grosor_de_piel: prediccion.grosor_de_piel,
        presion_arterial: prediccion.presion_arterial,
        fecha_de_nacimiento: prediccion.fecha_de_nacimiento,
      },
      { transaction }
    );

    // Confirmar transacción si todo fue exitoso
    await transaction.commit();

    // Responder al cliente
    res.status(201).json({
      message: "Paciente  creado correctamente.",
      paciente: nuevoPaciente,
      prediccion: nuevaPrediccion,
    });

    res.json({ message: "Paciente creado correctamente." });
  } catch (error) {
    // En caso de error, revertir la transacción
    await transaction.rollback();

    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//GET PACIENTES/:id
export const FindPacienteByIdCtrl = async (req, res) => {
  try {
    const paciente = await PacienteModel.findAll({
      where: { id: req.params.id },
    });
    res.json(paciente[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

//DELETE PACIENTES/:id
export const DeletePacienteByIdCtrl = async (req, res) => {
  try {
    await PacienteModel.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Paciente eliminado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar usuario." });
  }
};

//PATCH /PACIENTES/:id
export const UpdatePacienteByIdCtrl = async (req, res) => {
  try {
    await PacienteModel.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({
      message: "Paciente actualizado correctamente.",
    });
  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error al actualizar paciente." });
    
  }
};


