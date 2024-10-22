import pkg from "bcryptjs";
const { compareSync, genSaltSync, hashSync } = pkg;
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import byscript from "bcryptjs";
import { SECRET_JWT } from "../settings/environments.js";


const Register = async (req, res) => {
  try {
    console.log(req.body);
    
    const { nombre, email, password, confirmPassword, dni, telefono } =
      req.body;

    // Validamos que todos los campos requeridos estén presentes
    if (
      !nombre ||
      !email ||
      !password ||
      !confirmPassword ||
      !dni ||
      !telefono
    ) {
      return res.status(400).json({
        ok: false,
        message: "Faltan datos obligatorios.",
      });
    }

    // Validamos que la contraseña y la confirmación coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: "Las contraseñas no coinciden.",
      });
    }

    // Verificamos si ya existe un usuario con el email proporcionado
    const user = await UserModel.findOne(
      { where: { email: email } },
    );
    if (user) {
      return res.status(409).json({
        ok: false,
        message: "El email ya esta en uso.",
      });
    }

    
    const generateNumericId = () => {
      return Math.floor(Math.random() * 10000); // Cambia 1000000 a un valor mayor si necesitas un rango más amplio
    };

    // Uso en tu código
    const ids = generateNumericId();

    // const ids = crypto.randomUUID();

    // Generamos el "salt" para encriptar la contraseña
    const saltos = genSaltSync(10); // Corrección: usamos genSaltSync
    const hashedpassword = hashSync(password, saltos); // Encriptamos la contraseña

    /// Creamos el nuevo usuario en la base de datos
    const newUser = await UserModel.create({
      id: ids,
      id_rol: 2, // Asignar el rol por defecto
      username:nombre,
      email,
      password: hashedpassword,
      dni,
      telefono,
    });

    // Retornamos la respuesta con el nuevo usuario creado
    return res
      .status(201)
      .json({
        ok: true,
        message: "Usuario registrado con éxito",
        usuario: newUser,
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const Login = async (req, res) => {
  const {body} = req;
  const { email, password } = body;
  const authorization = req.get("Authorization");
  let decodedToken = {};

  // decodedToken = jwt.verify(token, SECRET_JWT);
  // console.log(decodedToken);

  //const {id:user_id} = decodedToken;

  try {
    // Buscar el usuario por email
    const usuario = await UserModel.findOne({
      where: {
        email: email, // Condición de búsqueda por email
      },
    });

    // Comparar la contraseña proporcionada con la almacenada

    const passwordCorrect =
      usuario === null
        ? false
        : await byscript.compare(password, usuario.password);

    if (!(usuario && passwordCorrect)) {
      return res
        .status(401)
        .json({ message: "Contraseña incorrecta o Usuario no valido" });
    }

    const userForToken = {
      id: usuario.id,
      email: usuario.email,
      username: usuario.username,
      password: usuario.password,
    };

    // Crear un token JWT con el email y el id del usuario
    const token = jwt.sign(
      userForToken,
      SECRET_JWT, // Clave secreta
      { expiresIn: "1h" } // Opciones del token
    );


    return res.send({
      email: usuario.email,
      password: usuario.password,
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error al inciar sesión.",
    });
  }
};

export const AuthController = {
  Register,
  Login,
};
