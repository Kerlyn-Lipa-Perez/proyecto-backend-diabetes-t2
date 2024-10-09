import { pool } from "../database/connection.js";

//GET /USERS
export const AllUsersCtrl = async (_req, res) => {
  try {
    // Realiza la consulta para obtener todos los usuarios
    const [users] = await pool.query(`SELECT * FROM usuarios`);

    // Enviar respuesta con los datos de los usuarios
    res.status(200).json(users);

  } catch (error) {
   
    console.log(error);
    res.status(500).json({ message: "Error al obtener los usuarios." });
  }
};

//POST /USERS
export const CreateUserCtrl = async (req, res) => {
  try {
    //Crear usuario 
    const { email, password, username } = req.body;

    const [newUser] = await pool.query(
      `INSERT INTO users (email, password, username) VALUES (?, ?, ?)`,
      [email, password, username]
    );

    console.log(newUser);

    const [userEncontrado] = await pool.execute(
      `SELECT * FROM users WHERE id = ?`,
      [newUser.insertId]
    );
    res.status(201).json(userEncontrado[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear usuario." });
  }
};

//GET USERS/:id
export const FindUserByIdCtrl = async (req, res) => {
  const userId = +req.params.id;
  try {
    //Encontrar usuario
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

    res.status(200).json(UsuarioEncontrado[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener usuario." });
  }
};

//DELETE USERS/:id
export const DeleteUserByIdCtrl = async (req, res) => {
  const userId = +req.params.id;
  try {
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
    //Devolver mensaje de eliminación
    res.status(203).json({
      message: "Usuario eliminado correctamente",
    });

    
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar usuario." });
  }
};

//PATCH /USERS/:id
export const UpdateUserByIdCtrl = async (req, res) => {
  const userId = +req.params.id;
  const { email, password, username } = req.body;
  try {
    
    //Actualizar usuario
    const [UsuarioUpdated] = await pool.execute(
      `UPDATE users SET email = ?, password = ?, username = ? WHERE id = ?`,
      [email, password, username, userId]
    );

    if (UsuarioUpdated.affectedRows == 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    //Devolver datos del usuario actualizado
    const [UsuarioEncontrado] = await pool.execute( 
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );

    res.status(201).json(UsuarioEncontrado[0]);

  } catch (error) {
    console.log(error);
     res.status(500).json({ message: "Error al actualizar usuario." });
  }
};


