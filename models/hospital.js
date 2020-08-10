const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalSchema = new Schema(
  {
    nombre: { type: String, required: [true, "El	nombre	es	necesario"] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, required: true, ref: "Usuario" },
  },
  { collection: "hospitales" }
);

hospitalSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = mongoose.model("Hospital", hospitalSchema);
