const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connection.openUri(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Base de datos BD: \x1b[32m%s\x1b[0m", " online");
  } catch (error) {
    console.log("error al iniciar BD ", error);
    throw new Error("error al iniciar BD ");
  }
};

module.exports = {
  dbConnection,
};
