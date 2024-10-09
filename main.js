import express from "express";
import { PORT } from "./src/settings/environments.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { authRoutes } from "./src/routes/auth.routes.js";
//Middlewares
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use("api/v1/", userRoutes);

app.use("/api/v1/auth/", authRoutes);



app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}` );
});

