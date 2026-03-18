const pool = require('../config/db');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { email, password } = req.body; 

  try {
    const result = await pool.query(
      'SELECT * FROM "User" WHERE email = $1 OR username = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({
        message: "¡Login exitoso!",
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        }
      });
    } else {
      res.status(401).json({ error: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error('[AUTH] Login Error:', error);
    res.status(500).json({ 
        error: "Error interno del servidor"
    });
  }
};

module.exports = { login };