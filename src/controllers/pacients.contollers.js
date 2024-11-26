// import PacienteModel from "../models/pacients.model.js";

// import PrediccionModel from "../models/prediction.model.js";


import { UserModel, RoleModel, PacienteModel ,PrediccionModel} from "../models/index.js";
import db from "../database/db.js";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { calculateDiabetesRiskPercentage } from "../ML/prediccion.js";

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const anioNacimiento = fechaNacimiento.getFullYear();
  const mesNacimiento = fechaNacimiento.getMonth();
  const diaNacimiento = fechaNacimiento.getDate();

  let edad = hoy.getFullYear() - anioNacimiento;

  // Si aún no es el cumpleaños este año, resta 1.
  if (
    hoy.getMonth() < mesNacimiento ||
    (hoy.getMonth() === mesNacimiento && hoy.getDate() < diaNacimiento)
  ) {
    edad--;
  }

  return edad;
};



// ------------- METODOS CRUD -------------//

//GET /PACIENTES
export const AllPacientesCtrl = async (req, res) => {
  try {
    const pacientes = await PacienteModel.findAll({
      attributes: [
        "id",
        "nombres",
        "apellidos",
        "fecha_nacimiento",
        "genero",
        "telefono",
        "DNI",
      ],
      include: [
        {
          model: PrediccionModel,
          as: "predicciones",
          attributes: ["puntaje_riesgo"],
          required: false, // Esto permite traer pacientes incluso si no tienen predicciones
        },
      ],
    });

    // Verificar si se encontraron pacientes
    if (pacientes.length === 0) {
      return res.status(404).json({
        message: "No se encontraron pacientes registrados",
      });
    }

    // Loguear para debug
    

    return res.status(200).json(pacientes);
  } catch (error) {
    console.error("Error en getAllPacientes:", error);
    return res.status(500).json({
      message: "Error al obtener los pacientes",
      error: error.message,
    });
  }
};
//POST /PACIENTES
export const CreatePacientesCtrl = async (req, res) => {
  // Iniciar transacción no administrada
  const transaction = await db.startUnmanagedTransaction();

  try {
    const {
      userId,
      nombres,
      apellidos,
      fecha_de_nacimiento,
      genero,
      telefono,
      dni,
      imc,
      glucosa,
      insulina,
      embarazos,
      grosor,
      presion,
      factor_hereditario,
    } = req.body;

    // Validación de campos requeridos
    const camposRequeridos = {
      userId,
      nombres,
      apellidos,
      fecha_de_nacimiento,
      genero,
      telefono,
      dni,
      imc,
      glucosa,
      insulina,
      grosor,
      presion,
      factor_hereditario,
    };

    const camposFaltantes = Object.entries(camposRequeridos)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposFaltantes.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Faltan campos requeridos: ${camposFaltantes.join(", ")}`,
        camposFaltantes,
      });
    }

    // Validar fecha de nacimiento
    const fechaNacimiento = new Date(fecha_de_nacimiento);
    if (isNaN(fechaNacimiento)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "El formato de la fecha de nacimiento es inválido" });
    }
    const fechaFormateada = fechaNacimiento.toISOString().split("T")[0];


    // Calcular la edad y preparar los datos para la predicción
    const datosPrediccion = {
      Bmi: (imc) || 0,
      Glucose: (glucosa) || 0,
      Insulin: (insulina) || 0,
      Pregnancies: Number(embarazos) || 0,
      SkinThickness: (grosor) || 0,
      BloodPressure: (presion) || 0,
      Dpf: (factor_hereditario) || 0,
      Age: calcularEdad(fechaNacimiento) || 0,
    };
    console.log(datosPrediccion);
  
    // Verificar valores NaN
    const valoresInvalidos = Object.entries(datosPrediccion)
      .filter(([_, value]) => Number.isNaN(value))
      .map(([key]) => key);

    if (valoresInvalidos.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Valores numéricos inválidos detectados en: ${valoresInvalidos.join(
          ", "
        )}`,
        valoresInvalidos,
      });
    }
    const generateNumericId = () => {
      return Math.floor(Math.random() * 10000);
    };

    // Generacion de ids
    const ids = generateNumericId();
    // Crear el registro del paciente
    const paciente = await PacienteModel.create(
      {
        id: ids,
        id_usuario: userId,
        nombres,
        apellidos,
        fecha_nacimiento: fechaFormateada,
        genero,
        telefono: telefono?.toString(),
        DNI: dni?.toString(),
      },
      { transaction }
    );

    // Llamada a la API de Flask para la predicción
    let prediction;
    try {
      const flaskRespuesta = await axios.post(
        "http://127.0.0.1:8000/predict",
        datosPrediccion
      );
      prediction = flaskRespuesta.data.prediction;
      console.log(prediction);
    } catch (flaskError) {
      await transaction.rollback();
      return res.status(500).json({
        message: "Error en el servicio de predicción",
        error: flaskError.message,
      });
    }

    //Cambiar el valor de la predicción a un porcentaje segun los valores de la predicción probablemente con una funcion

    const riskPercentage = calculateDiabetesRiskPercentage(
      prediction,
      datosPrediccion
    );

    

    // Crear el registro de la predicción
    const prediccion = await PrediccionModel.create(
      {
        id_paciente: paciente.id,
        fecha_prediccion: new Date(),
        imc: datosPrediccion.Bmi,
        glucosa: datosPrediccion.Glucose,
        insulina: datosPrediccion.Insulin,
        puntaje_riesgo: riskPercentage,
        fecha_creacion: new Date(),
        creado_por: userId,
        embarazos: datosPrediccion.Pregnancies,
        grosor_de_piel: datosPrediccion.SkinThickness,
        presion_arterial: datosPrediccion.BloodPressure,
        fecha_de_nacimiento: fechaFormateada,
      },
      { transaction }
    );

    // Si todo sale bien, confirmar la transacción
    await transaction.commit();

    return res.status(201).json({
      message: "Paciente y predicción creados correctamente",
      paciente,
      prediccion,
    });
  } catch (error) {
    // En caso de error, revertir la transacción
    await transaction.rollback();
    console.error("Error detallado:", error);
    return res.status(500).json({
      message: "Error al procesar la solicitud",
      error: error.message,
    });
  }
};




//GET PACIENTES/:id
export const FindPacienteByIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await PacienteModel.findByPk(id, {
      attributes: [
        "id",
        "nombres",
        "apellidos",
        "fecha_nacimiento",
        "genero",
        "telefono",
        "DNI",
      ],
      include: [
        {
          model: PrediccionModel,
          as: "predicciones",
          attributes: [
            "fecha_prediccion",
            "puntaje_riesgo",
            "glucosa",
            "insulina",
            "imc",
            "embarazos",  
            "grosor_de_piel",
            "presion_arterial", 
          ],
          order: [["fecha_prediccion", "DESC"]],
          include: [
            {
              model: UserModel,
              as: "creador",
              attributes: ["username", "email", "id"],
            },
          ],
        },
        {
          model: UserModel,
          as: "usuario",
          attributes: ["username", "email", "id"],
        },
      ],
    });

    if (!paciente) {
      return res.status(404).json({
        status: "error",
        message: "Paciente no encontrado",
      });
    }

    const pacienteData = paciente.get({ plain: true });


    res.json({
      status: "Paciente obtenido correctamente",
      data: pacienteData,
    });
  } catch (error) {
    console.error("Error en GetPacienteCtrl:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener el paciente.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
  // Iniciar transacción no administrada
  const transaction = await db.startUnmanagedTransaction();

  try {
    const { id } = req.params;
    const {
      userId,
      nombres,
      apellidos,
      fecha_de_nacimiento,
      genero,
      telefono,
      dni,
      imc,
      glucosa,
      insulina,
      embarazos,
      grosor,
      presion,
      factor_hereditario,
    } = req.body;

    // Validación de campos requeridos
    const camposRequeridos = {
      userId,
      nombres,
      apellidos,
      fecha_de_nacimiento,
      genero,
      telefono,
      dni,
      imc,
      glucosa,
      insulina,
      grosor,
      presion,
      factor_hereditario,
    };
    console.log(camposRequeridos)

    const camposFaltantes = Object.entries(camposRequeridos)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposFaltantes.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Faltan campos requeridos: ${camposFaltantes.join(", ")}`,
        camposFaltantes,
      });
    }

    // Validar fecha de nacimiento
    const fechaNacimiento = new Date(fecha_de_nacimiento);
    if (isNaN(fechaNacimiento)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "El formato de la fecha de nacimiento es inválido" });
    }
    const fechaFormateada = fechaNacimiento.toISOString().split("T")[0];

    // Calcular la edad y preparar los datos para la predicción
    const datosPrediccion = {
      Bmi: imc || 0,
      Glucose: glucosa || 0,
      Insulin: insulina || 0,
      Pregnancies: Number(embarazos) || 0,
      SkinThickness: grosor || 0,
      BloodPressure: presion || 0,
      Dpf: factor_hereditario || 0,
      Age: calcularEdad(fechaNacimiento) || 0,
    };

    // Verificar valores NaN
    const valoresInvalidos = Object.entries(datosPrediccion)
      .filter(([_, value]) => Number.isNaN(value))
      .map(([key]) => key);

    if (valoresInvalidos.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Valores numéricos inválidos detectados en: ${valoresInvalidos.join(
          ", "
        )}`,
        valoresInvalidos,
      });
    }

    // Actualizar el registro del paciente
    const [updatedRowsCount] = await PacienteModel.update(
      {
        id_usuario: userId,
        nombres,
        apellidos,
        fecha_nacimiento: fechaFormateada,
        genero,
        telefono: telefono?.toString(),
        DNI: dni?.toString(),
      },
      {
        where: { id },
        transaction,
      }
    );

    if (updatedRowsCount === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // Llamada a la API de Flask para la predicción
    let prediction;
    try {
      const flaskRespuesta = await axios.post(
        "http://127.0.0.1:8000/predict",
        datosPrediccion
      );
      prediction = flaskRespuesta.data.prediction;
      console.log(prediction);
    } catch (flaskError) {
      await transaction.rollback();
      return res.status(500).json({
        message: "Error en el servicio de predicción",
        error: flaskError.message,
      });
    }

    // Calcular porcentaje de riesgo
    const riskPercentage = calculateDiabetesRiskPercentage(
      prediction,
      datosPrediccion
    );

    // Eliminar predicciones anteriores para este paciente
    await PrediccionModel.destroy({
      where: { id_paciente: id },
      transaction,
    });

    // Crear nuevo registro de predicción
    const prediccion = await PrediccionModel.create(
      {
        id_paciente: id,
        fecha_prediccion: new Date(),
        imc: datosPrediccion.Bmi,
        glucosa: datosPrediccion.Glucose,
        insulina: datosPrediccion.Insulin,
        puntaje_riesgo: riskPercentage,
        fecha_creacion: new Date(),
        creado_por: userId,
        embarazos: datosPrediccion.Pregnancies,
        grosor_de_piel: datosPrediccion.SkinThickness,
        presion_arterial: datosPrediccion.BloodPressure,
        fecha_de_nacimiento: fechaFormateada,
      },
      { transaction }
    );

    // Si todo sale bien, confirmar la transacción
    await transaction.commit();

    return res.status(200).json({
      message: "Paciente y predicción actualizados correctamente",
      paciente: { id, ...req.body },
      prediccion,
    });
  } catch (error) {
    // En caso de error, revertir la transacción
    await transaction.rollback();
    console.error("Error detallado:", error);
    return res.status(500).json({
      message: "Error al procesar la solicitud de actualización",
      error: error.message,
    });
  }
};
