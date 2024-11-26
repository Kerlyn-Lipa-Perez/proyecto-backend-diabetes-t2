import * as fs from "node:fs";
import YDFInference from "ydf-inference";



import PacienteModel from "../models/pacients.model.js";
import PrediccionModel from "../models/prediction.model.js";
const calculateDiabetesRisk = (data) => {
  const {
    IMC,
    glucosa,
    insulina,
    grosor_de_piel,
    presion_arterial,
    embarazos,
  } = data;

  let riskScore = 0;

  // Weight factors for each parameter
  if (glucosa > 140) riskScore += 30;
  if (IMC > 30) riskScore += 20;
  if (presion_arterial > 140) riskScore += 15;
  if (insulina > 160) riskScore += 15;
  if (grosor_de_piel > 35) riskScore += 10;
  if (embarazos > 4) riskScore += 10;

  // Normalize score to percentage
  return Math.min(Math.max(riskScore, 0), 100);
};

export const createPrediction = async (req, res) => {
  try {
    const predictionData = req.body;
    const riskScore = calculateDiabetesRisk(predictionData);

    const prediction = await PrediccionModel.create({
      ...predictionData,
      puntaje_riesgo: riskScore,
      creado_por: req.user.id,
    });

    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllPredictonsContoller = async (req, res) => {
  try {
    const predictions = await PrediccionModel.findAll({
      where: { id_paciente: req.params.id },
      include: [
        {
          model: PacienteModel,
          attributes: ["nombres", "apellidos", "DNI", "telefono", "genero"],
        },
      ],
      order: [["fecha_prediccion", "DESC"]],
    });

    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const FindPredictionByIdCtrl = async (req, res) => {
  try {
    const predictions = await PrediccionModel.findAll({
      where: { id_paciente: req.params.id },
      include: [
        {
          model: PacienteModel,
          attributes: ["nombres", "apellidos", "DNI", "telefono", "genero"],
        },
      ],
      order: [["fecha_prediccion", "DESC"]],
    });

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllPredictonsContoller,
  FindPredictionByIdCtrl,
  createPrediction,
};
