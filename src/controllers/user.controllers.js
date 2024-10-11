
import UserModel from "../models/user.model.js";


// ------------- METODOS CRUD -------------//

//GET /USERS
export const AllUsersCtrl = async (_req, res) => {
  try {
    // Realiza la consulta para obtener todos los usuarios
    const usuarios = await UserModel.findAll()

    // Enviar respuesta con los datos de los usuarios
    res.json(usuarios);

  } catch (error) {
   
    console.log(error);
    res.json({ message: "Error al obtener los usuarios." });
  }
};

//POST /USERS
export const CreateUserCtrl = async (req, res) => {
  try {
    //Crear usuario 
    await UserModel.create(req.body);
    /*
    const { email, password, username } = req.body;

    const [newUser] = await pool.query(
      `INSERT INTO usuarios (email, password, username) VALUES (?, ?, ?)`,
      [email, password, username]
    );

    console.log(newUser);

    const [userEncontrado] = await pool.execute(
      `SELECT * FROM usuarios WHERE id = ?`,
      [newUser.insertId]
    );
    */

    res.json({
      "message":"Usuario creado correctamente."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//GET USERS/:id
export const FindUserByIdCtrl = async (req, res) => {

  try {

    const usuario = await UserModel.findAll({
      where :{
        id: req.params.id
      }
    })
    //Encontrar usuario
    /*
    const [UsuarioEncontrado] = await pool.execute(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    //Si no se encuentra el usuario, devolver error
    if (UsuarioEncontrado.length <1) {
      return res.status(404).json({
         message: "Usuario no encontrado" 
        });
    }
    */

    res.json(usuario[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//DELETE USERS/:id
export const DeleteUserByIdCtrl = async (req, res) => {
  try {
    await UserModel.destroy({
      where:{id:req.params.id}
    })
    /*
    const userId = +req.params.id;

    //Eliminar usuario
    const [UsuarioDeleted] = await pool.execute(
      `DELETE FROM users WHERE id = ?`,
      [userId]
    );

    if (UsuarioDeleted.affectedRows == 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
      */
    //Devolver mensaje de eliminación
    res.json({
      message: "Usuario eliminado correctamente",
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar usuario." });
  }
};

//PATCH /USERS/:id
export const UpdateUserByIdCtrl = async (req, res) => {
  try {
    await UserModel.update(req.body,{
      where: {id:req.params.id}
    })


    res.json({
      "message":"Usuario actualizado correctamente."
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar usuario." });
  }
};


