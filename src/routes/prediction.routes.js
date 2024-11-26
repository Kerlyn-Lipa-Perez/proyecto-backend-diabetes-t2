import { Router } from "express";
import {
  getAllPredictonsContoller,
  FindPredictionByIdCtrl,
} from "../controllers/prediction.controller.js";


const predictionRouter = Router();



predictionRouter.get("/", getAllPredictonsContoller);

predictionRouter.get("/:id", FindPredictionByIdCtrl);



export  {predictionRouter};
