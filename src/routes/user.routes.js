import { Router } from "express";
import { AllUsersCtrl, CreateUserCtrl, DeleteUserByIdCtrl, FindUserByIdCtrl, UpdateUserByIdCtrl } from "../controllers/user.controllers.js";

const userRoutes = Router();


userRoutes.get("/", AllUsersCtrl);

userRoutes.get("/:id", FindUserByIdCtrl);

userRoutes.post("/", CreateUserCtrl);

userRoutes.patch("/:id", UpdateUserByIdCtrl);

userRoutes.delete("/:id", DeleteUserByIdCtrl);


export  {userRoutes};
