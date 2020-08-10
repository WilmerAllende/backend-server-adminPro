/*
PATH: '/api/usuario'
*/
const Usuario = require("../models/usuario");
var bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res, next) => {
  const desde = Number(req.query.desde) || 0;

  try {
    const [usuarios, total] = await Promise.all([
      Usuario.find({}, "nombre email img role google").skip(desde).limit(5),
      Usuario.count(),
    ]);

    res.status(200).json({
      ok: true,
      total,
      usuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno, comuniquese con el administrador",
    });
  }

  /*
  // Otra forma de hacerlo

  Usuario.find({}, "nombre email img role google")
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

    */
};

const crearUsuario = async (req, res, next) => {
  var body = req.body;

  const salt = bcrypt.genSaltSync();
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    //password: bcrypt.hashSync(body.password, 10),
    password: bcrypt.hashSync(body.password, salt),
    // img: body.img,
    // role: body.role,
  });

  try {
    const existeEmail = await Usuario.findOne({ email: usuario.email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        mensaje: "El correo ya está registrado " + existeEmail.email,
      });
    }

    await usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear usuario",
          errors: err,
        });
      }
    });

    const token = await generarJWT(usuario.id);

    res.status(201).json({
      ok: true,
      usuario,
      //usuarioToken: req.usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      errors: error,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res, next) => {
  //
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mdg: "No existe un usuario con ese id",
      });
    }

    // Actualizar usuario

    const { password, google, email, ...campos } = req.body;
    // Hacer lo de arriba es acortar como lo de abajo - quitar campos de la variable campos
    // delete campos.password;
    // delete campos.google;

    if (email !== usuarioDB.email) {
      // const existeEmail = await Usuario.findOne({ email: req.body.email });
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }
    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      errors: error,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const borrarUsuario = async (req, res, next) => {
  const uid = req.params.id;
  try {
    usuarioBD = await Usuario.findById(uid);

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    await Usuario.findByIdAndDelete(uid, (err, usuarioBorrado) => {
      if (err) {
        res.status(500).json({
          ok: false,
          msg: "Error inesperado al eliminar... revisar logs",
          errors: error,
        });
      }
      res.json({
        ok: true,
        msg: "Usuario eliminado",
        usuarioBorrado: usuarioBorrado,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
      errors: error,
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
