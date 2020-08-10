const { response } = require("express");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  try {
    const medicos = await Medico.find()
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");
    res.status(200).json({
      ok: true,
      medicos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: true,
      msg: "Error interno. Comuniquese con el administrador",
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;

  try {
    const medico = new Medico({
      usuario: uid,
      ...req.body,
    });
    const medicoDB = await medico.save();
    res.status(201).json({
      ok: true,
      medico: medicoDB,
      msg: "Medico creado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno. Comuniquese con el administrador",
    });
  }
};

const actualizarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizar Medico",
  });
};

const borrarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: "borrar Medico",
  });
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
