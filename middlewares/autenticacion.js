var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;
// =====================================
// VERIFICAR TOKEN
// =====================================
const verificaToken = function (req, res, next) {
  //Leer token

  // Como parametro
  // const token = req.query.token;

  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No se ha envio token de seguridad",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      errors: error,
      msg: "Token no valido",
    });
  }

  /*
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token incorrecto",
        errors: err,
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
  */
};

module.exports = {
  verificaToken,
};

// app.use("/", (req, res, next) => {});
