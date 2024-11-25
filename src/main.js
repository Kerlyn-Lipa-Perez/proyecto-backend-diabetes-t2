import express from "express";
import db from "./database/db.js";
import { userRoutes } from "./routes/user.routes.js";
import { pacienteRoutes } from "./routes/paciente.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { predictionRouter } from "./routes/prediction.routes.js";

import {PORT} from "./settings/environments.js";
import cors from "cors";
import morgan from "morgan";


const app = express();

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/users", userRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/", authRoutes);

app.use("/api/", predictionRouter);



try {
    await db.authenticate()
    console.log("Conexion exitosa a la base de datos.")
    
} catch (error) {
    console.log(`El error de conexion es: ${error}`);
    
}

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}` );
});

