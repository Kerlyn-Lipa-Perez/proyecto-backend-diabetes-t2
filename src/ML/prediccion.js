
import * as fs from "node:fs";
import YDFInference from "ydf-inference";

import PacienteModel from "../models/pacients.model.js";
import PrediccionModel from "../models/prediction.model.js";


export function calculateDiabetesRiskPercentage(prediction, datosPrediccion) {
  // If prediction is 0 (low risk), return low percentage
  if (prediction === 0) {
    return 10 + Math.random() * 10; // 10-20% risk
  }

  // If prediction is 1 (high risk), calculate based on input factors
  if (prediction === 1) {
    // Base high-risk percentage
    let baseRisk = 70;

    // Adjust risk based on different factors
    if (datosPrediccion.Bmi > 30) baseRisk += 10; // Obesity
    if (datosPrediccion.Glucose > 125) baseRisk += 10; // High glucose
    if (datosPrediccion.Insulin > 25) baseRisk += 5; // High insulin
    if (datosPrediccion.Pregnancies > 2) baseRisk += 5; // Multiple pregnancies
    if (datosPrediccion.BloodPressure > 140) baseRisk += 5; // High blood pressure
    if (datosPrediccion.Age > 45) baseRisk += 5; // Age factor

    // Ensure risk doesn't exceed 95%
    return Math.min(baseRisk, 95);
  }

  // Fallback for unexpected prediction values
  return 50; // Default mid-range risk
}