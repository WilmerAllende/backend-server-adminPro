// Requires
var express = require("express");

// Incializar variables
var app = express();

var Hospital = require("../models/hospital");

app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  BuscarHospitales(busqueda, regex).then((hospitales) => {
    res.status(200).json({
      ok: true,
      hospitales: hospitales,
    });
  });
});

function BuscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex }, (err, hospitales) => {
      if (err) {
        reject("Error al cargar hospitales", err);
      } else {
        resolve(hospitales);
      }
    });
  });
}

module.exports = app;
