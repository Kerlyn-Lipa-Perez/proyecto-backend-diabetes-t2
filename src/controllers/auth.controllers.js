import { UserModel } from "../models/user.model.js";
import pkg from "bcryptjs";
const { bcryptjs } = pkg;


const Register = async (req, res) => {
  try {
    console.log(req.body);
    const {  id_rol, username, email, password ,} = req.body;

    if (!email || !password || !username ) {
      
      return res.status(400).json({
        ok: false,
        message: "Faltan datos obligatorios.",
        
        
      });
    }

    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        ok: false,
        message: "El nombre de usuario solo puede contener letras y números.",
      });
    }
    /*
    const user = await UserModel.BuscarPorEmail(email);
    if (user) {
      return res.status(409).json({
        ok: false,
        message: "El email ya esta en uso.",
      });
    }
    */

    //const saltos = await bcryptjs.genSaltSync(10);

    //const hashedpassword = await bcryptjs.hash(password, saltos);


    const newUser = await UserModel.crearUsuario(
      id_rol, username,
      email,
      password
    );

    return res.status(201).json({ ok: true, msg: newUser });

    

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error al registrar usuario.",
    });
  }
};



const Login = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error al registrar usuario.",
    });
  }
};

export const AuthController = {
  Register,
  Login,
};
