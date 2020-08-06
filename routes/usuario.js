// Requires
var express = require("express");
var bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

var mdAutenticacion = require("../middlewares/autenticacion");
// Incializar variables
var app = express();

var Usuario = require("../models/usuario");
const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuario");
const { verificaToken } = require("../middlewares/autenticacion");

// =====================================
// LISTAR USUARIOS
// =====================================

app.get("/", verificaToken, getUsuarios);
/*
app.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Usuario.find({}, "nombre email img role")
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando usuario",
          errors: err,
        });
      }
      // Usuario.count({ nombre: ["test1", "test3"] }, (err, conteo)
      Usuario.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          total: conteo,
          usuarios: usuarios,
        });
      });
    });
});



  [
    check("nombre").not().isEmpty(),
    check("password").not().isEmpty(),
    check("email").isEmail(),
  ],
*/
// =====================================
// CREAR UN NUEVO USUARIO
// =====================================
app.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuario
);
//app.post("/", mdAutenticacion.verificaToken, crearUsuario);

/*
app.post("/", mdAutenticacion.verificaToken, (req, res, next) => {
  var body = req.body;
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuarioToken: req.usuario,
    });
  });
});
*/

// =====================================
// ACTUALIZAR UN USUARIO
// =====================================
//Solo actualzar el usuario que ingresa al sistema (su propia cuenta)

// Actualizar usuario colocando el id
app.put(
  "/:id",
  [
    verificaToken,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("role", "El rol es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  actualizarUsuario
);
/*
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id " + id + " no existe",
        errors: { message: "No existe un usuario con ese id" },
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err,
        });
      }
      usuarioGuardado.password = ":)";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioToken: req.usuario,
      });
    });
  });
});
*/
// =====================================
// ELIMINAR UN USUARIO POR ID
// =====================================

app.delete("/:id", verificaToken, borrarUsuario);
/*
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar usuario",
        errors: err,
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con ese id",
        errors: { message: "No existe el usuario" },
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado,
      usuarioToken: req.usuario,
    });
  });
});
*/
module.exports = app;
