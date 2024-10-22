import { Router } from "express";
import AllPrediccionCtrl from "../controllers/prediction.controller.js";

const predictRoutes = Router();

predictRoutes.post("/predict-diabetes",AllPrediccionCtrl);

export default predictRoutes;
