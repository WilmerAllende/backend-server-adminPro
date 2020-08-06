const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Verificar email
    const usuarioBD = await Usuario.findOne({ email });
    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        msg: "Email (x) o contraseña no valido",
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioBD.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Email o contraseña (x) no valido",
      });
    }

    // Generar el token JWT
    const token = await generarJWT(usuarioBD.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, comuniquese con el administrador",
    });
  }
};

module.exports = {
  login,
};
