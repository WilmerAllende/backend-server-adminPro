const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido",
};

const usuarioSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: { type: String, required: [true, "La contraseña es necesaria"] },
  img: { type: String, required: false },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

usuarioSchema.plugin(uniqueValidator, { message: "El correo debe ser único" });

module.exports = mongoose.model("Usuario", usuarioSchema);
