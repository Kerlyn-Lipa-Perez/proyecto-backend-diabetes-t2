import { Router } from "express";
import { AllUsersCtrl, CreateUserCtrl, DeleteUserByIdCtrl, FindUserByIdCtrl, UpdateUserByIdCtrl } from "../controllers/user.controllers.js";

const userRoutes = Router();


userRoutes.get("/users", AllUsersCtrl);


userRoutes.post("/users", CreateUserCtrl);

userRoutes.get("/users/:id", FindUserByIdCtrl);

userRoutes.put("/users/:id", UpdateUserByIdCtrl);

userRoutes.delete("/users/:id", DeleteUserByIdCtrl);


export {userRoutes};
