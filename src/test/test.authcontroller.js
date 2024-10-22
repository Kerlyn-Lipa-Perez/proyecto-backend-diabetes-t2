import { AuthController } from "./authController";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../models/user.model.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  describe("Register", () => {
    it("debería registrar un usuario correctamente", async () => {
      const req = {
        body: {
          nombre: "Test User",
          email: "test@example.com",
          password: "123456",
          confirmPassword: "123456",
          dni: "12345678",
          telefono: "987654321",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserModel.findAll.mockResolvedValue([]); // No hay usuarios
      bcrypt.genSaltSync.mockReturnValue("salt");
      bcrypt.hashSync.mockReturnValue("hashedpassword");
      UserModel.crearUsuario.mockResolvedValue({ id: 1 });

      await AuthController.Register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: "Usuario registrado con éxito",
        usuario: { id: 1 },
      });
    });

    it("debería devolver un error si el email ya está en uso", async () => {
      const req = {
        body: {
          nombre: "Test User",
          email: "test@example.com",
          password: "123456",
          confirmPassword: "123456",
          dni: "12345678",
          telefono: "987654321",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserModel.findAll.mockResolvedValue([{}]); // Usuario existente

      await AuthController.Register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        ok: false,
        message: "El email ya esta en uso.",
      });
    });
  });

  describe("Login", () => {
    it("debería iniciar sesión correctamente y devolver un token", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserModel.findOne.mockResolvedValue({
        email: "test@example.com",
        password: "hashedpassword",
      });
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue("token");

      await AuthController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "123456", // Esto no debería enviarse
        token: "token",
      });
    });

    it("debería devolver un error si la contraseña es incorrecta", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "wrongpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserModel.findOne.mockResolvedValue({
        email: "test@example.com",
        password: "hashedpassword",
      });
      bcrypt.compareSync.mockReturnValue(false);

      await AuthController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contraseña incorrecta",
      });
    });

    it("debería devolver un error si el usuario no existe", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      UserModel.findOne.mockResolvedValue(null); // Usuario no encontrado

      await AuthController.Login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });
  });
});
