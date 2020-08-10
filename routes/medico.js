// Requires
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

// Incializar variables
const app = Router();

var Usuario = require("../models/usuario");

const { verificaToken } = require("../middlewares/autenticacion");
const {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
} = require("../controllers/medicos");

// =====================================
// LISTAR MEDICOS
// =====================================

app.get("/", verificaToken, getMedicos);

// =====================================
// CREAR UN NUEVO MEDICO
// =====================================
app.post(
  "/",
  [
    verificaToken,
    check("nombre", "Nombre de medico es obligatorio").not().isEmpty(),
    check("hospital", "Hopital debe ser valido").isMongoId(),
    //check("hospital", "Hopital es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearMedico
);

// =====================================
// ACTUALIZAR UN MEDICO
// =====================================
app.put("/:id", [], actualizarMedico);

// =====================================
// ELIMINAR UN MEDICO POR ID
// =====================================

app.delete("/:id", verificaToken, borrarMedico);

module.exports = app;

/*
// Requires
var express = require("express");

var mdAutenticacion = require("../middlewares/autenticacion");
// Incializar variables
var app = express();

var Medico = require("../models/medico");

// =====================================
// LISTAR Medicos
// =====================================

app.get("/", (req, res) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Medico.find({}, "nombre img usuario Medico")
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("Medico")
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando medicos",
          errors: err,
        });
      }
      Medico.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          total: conteo,
          medicos: medicos,
        });
      });
    });
});

// =====================================
// CREAR UN NUEVO MEDICO
// =====================================

app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;
  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    Medico: body.Medico,
  });

  medico.save((err, MeidcoGuardado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al crear medico",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      medico: MeidcoGuardado,
    });
  });
});

// =====================================
// ACTUALIZAR UN MEDICO CON ID
// =====================================

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;
  var id = req.params.id;

  Medico.findById(id, (err, medicoBuscado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al crear medico",
        errors: err,
      });
    }
    if (!medicoBuscado) {
      return res.status(400).json({
        ok: false,
        mensaje: "Medico con el id" + id + " no encontrado",
        errors: { message: "Medico no encontrado" },
      });
    }
    medicoBuscado.nombre = body.nombre;
    // medicoBuscado.img = body.img;
    medicoBuscado.usuario = req.usuario._id;
    medicoBuscado.Medico = body.Medico;

    medicoBuscado.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar medico",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado,
      });
    });
  });
});

// =====================================
// ELIMINAR UN MEDICO POR ID
// =====================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar medico",
        errors: err,
      });
    }
    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "Medico con el id" + id + " no encontrado",
        errors: { message: "Medico no encontrado" },
      });
    }
    res.status(200).json({
      ok: true,
      medico: medicoBorrado,
      usuarioToken: req.usuario,
    });
  });
});

module.exports = app;
*/
