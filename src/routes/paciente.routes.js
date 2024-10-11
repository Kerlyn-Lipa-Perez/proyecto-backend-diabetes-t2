import { Router } from "express";
import {
  AllPacientesCtrl,
  CreatePacientesCtrl,
  DeletePacienteByIdCtrl,
  FindPacienteByIdCtrl,
  UpdatePacienteByIdCtrl,
} from "../controllers/pacients.contollers.js";


const pacienteRoutes = Router();

pacienteRoutes.get("/", AllPacientesCtrl);

pacienteRoutes.get("/:id", FindPacienteByIdCtrl);

pacienteRoutes.post("/", CreatePacientesCtrl);

pacienteRoutes.patch("/:id", UpdatePacienteByIdCtrl);

pacienteRoutes.delete("/:id", DeletePacienteByIdCtrl);

export  {pacienteRoutes};