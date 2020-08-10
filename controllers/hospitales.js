const { response } = require("express");
const Hospital = require("../models/hospital");

const getHospitales = async (req, res = response) => {
  try {
    const hospitales = await Hospital.find().populate("usuario", "nombre img");
    res.status(200).json({
      ok: true,
      hospitales,
      msg: "Hospitales",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno. Comuniquese con el administrador",
    });
  }
};

const crearHospital = async (req, res = response) => {
  const uid = req.uid;

  try {
    const hospital = new Hospital({
      usuario: uid,
      ...req.body,
    });
    const hospitalDB = await hospital.save();
    res.status(201).json({
      ok: true,
      hospital: hospitalDB,
      msg: "Hospital creado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno. Comuniquese con el administrador",
    });
  }
};

const actualizarHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizar hospital",
  });
};

const borrarHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "borrar hospital",
  });
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
