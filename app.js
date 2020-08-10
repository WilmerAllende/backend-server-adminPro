// Requires
require("dotenv").config();

const express = require("express");
const cors = require("cors");

var mongoose = require("mongoose");
var bodyParser = require("body-parser");

const { dbConnection } = require("./database/config");

// Incializar variables
var app = express();

// Configurar cors
app.use(cors());

// Conexion a Base de datos
dbConnection();

//console.log(process.env);

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var medicoRoutes = require("./routes/medico");
var busquedaRoutes = require("./routes/busqueda");

// Conexion a la base de datos
/*
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, res) => {
    if (err) throw err;
    console.log("Base de datos: \x1b[32m%s\x1b[0m", " online");
  }
);
*/
// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/hospitales", hospitalRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/busqueda", busquedaRoutes);

app.use("/", appRoutes);

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(
    "Express server puerto " + process.env.PORT + ": \x1b[32m%s\x1b[0m",
    " online"
  );
});
