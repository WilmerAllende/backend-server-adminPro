// Requires
var express = require("express");

var mdAutenticacion = require("../middlewares/autenticacion");
// Incializar variables
var app = express();

var Hospital = require("../models/hospital");

// =====================================
// LISTAR HOSPITALES
// =====================================

app.get("/", (req, res) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Hospital.find({}, "nombre img usuario")
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando hospitales",
          errors: err,
        });
      }
      Hospital.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          total: conteo,
          hospitales: hospitales,
        });
      });
    });
});

// =====================================
// CREAR UN NUEVO HOSPITAL
// =====================================

app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id,
  });

  hospital.save((err, HospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear hospital",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      hospital: HospitalGuardado,
    });
  });
});

// =====================================
// ACTUALIZAR UN HOSPITAL
// =====================================

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al editar hospital",
        errors: err,
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: "El hospital no existe" },
      });
    }
    hospital.nombre = body.nombre;
    // hospital.img = body.img;

    //hospital.usuario = body.usuario;
    hospital.usuario = req.usuario._id;
    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado,
        usuarioToken: req.usuario,
      });
    });
  });
});

// =====================================
// ELIMINAR UN HOSPITAL POR ID
// =====================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, HospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar hospital",
        errors: err,
      });
    }
    if (!HospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un hospital con ese id",
        errors: { message: "No existe el hospital" },
      });
    }

    res.status(200).json({
      ok: true,
      hospitalBor: HospitalBorrado,
      usuarioToken: req.usuario,
    });
  });
});

module.exports = app;
