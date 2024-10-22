import PacienteModel from "../models/pacients.model.js";
import jwt from "jsonwebtoken";
import PrediccionModel from "../models/prediction.model.js";

// ------------- METODOS CRUD -------------//
export const AllPrediccionCtrl = async (req, res) => {
  const { imc, glucosa, insulina, puntaje_riesgo, embarazos, grosor_de_piel, presion_arterial, fecha_de_nacimiento } = req.body;

  try {
    // Aquí se debería cargar el modelo y realizar la predicción
    const prediction = model.predict([
      [age, bmi, bloodPressure, ...otherFeatures],
    ]);
    // Devuelve solo el valor de la predicción
    res.json({ diabetesRisk: prediction[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al predecir el riesgo de diabetes" });
  }
};


export {AllPrediccionCtrl};