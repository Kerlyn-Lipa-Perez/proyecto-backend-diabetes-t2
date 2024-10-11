import  PacienteModel  from "../models/pacients.model.js";


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
    await PacienteModel.create(req.body);
    res.json({ message: "Paciente creado correctamente." });
  } catch (error) {
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


