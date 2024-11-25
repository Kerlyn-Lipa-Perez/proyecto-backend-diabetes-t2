import { Router } from "express";
import {
  createPrediction,
  getPatientPredictions,
} from "../controllers/prediction.controller.js";


const predictionRouter = Router();


predictionRouter.post("/", createPrediction);
predictionRouter.get("/patient/:patientId", getPatientPredictions);


export  {predictionRouter};
