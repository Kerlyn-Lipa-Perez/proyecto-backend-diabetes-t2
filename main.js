import express from "express";
import { PORT } from "./src/settings/environments.js";
import db from "./src/database/db.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { pacienteRoutes } from "./src/routes/paciente.routes.js";
//Middlewares
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


const app = express();

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use("/api/users", userRoutes);
app.use("/api/pacientes", pacienteRoutes);


try {
    await db.authenticate()
    console.log("Conexion exitosa a la base de datos.")
    
} catch (error) {
    console.log(`El error de conexion es: ${error}`);
    
}

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}` );
});

