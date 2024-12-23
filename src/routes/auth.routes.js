import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers.js";

const authRoutes = Router();

authRoutes.post("/register", AuthController.Register);


authRoutes.post("/login", AuthController.Login);

authRoutes.get("/login", AuthController.Login);

export { authRoutes };  

//admin@example.com

//password123