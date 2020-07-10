// Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;

// Incializar variables
var app = express();
var Usuario = require("../models/usuario");

app.post("/", (req, res) => {
  var body = req.body;
  Usuario.findOne({ email: body.email }, (err, UsuarioBuscado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al realizar login",
        errors: err,
      });
    }

    if (!UsuarioBuscado) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - email",
        errors: err,
      });
    }

    if (!bcrypt.compareSync(body.password, UsuarioBuscado.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - password",
        errors: err,
      });
    }

    // Crear un token
    UsuarioBuscado.password = ":)";
    var token = jwt.sign({ usuario: UsuarioBuscado }, SEED, {
      expiresIn: 14400,
    }); // 4 horas

    res.status(200).json({
      ok: true,
      usuario: UsuarioBuscado,
      token: token,
      id: UsuarioBuscado._id,
    });
  });
});

module.exports = app;
