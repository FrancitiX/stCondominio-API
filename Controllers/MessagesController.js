var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var bodyParser = require("body-parser");
require("dotenv").config();
const { sendMessage, getTextMessageInput } = require("../messageHelper");

router.use(bodyParser.json());

require("./../Schemas/userSchema");
const User = mongoose.model("users");

const RestorePasswordMessage = async (req, res) => {
  const number = req.body.number;

  try {
    if (!number) {
      return res.status(400).send({ error: "Número de teléfono requerido" });
    }

    const user = await User.findOne({ cellphone: number });

    if (!user) {
      return res
        .status(400)
        .send({ error: "No se encontró el número de teléfono registrado" });
    }

    const data = getTextMessageInput(
      "+52" + number,
      "Para resolver su problema de acceso ingrese a TANGAMANDAIO!"
    );

    await sendMessage(data);

    console.log("Si jaló el wasa");
    return res
      .status(200)
      .send({ status: "ok", data: "Se envió con éxito la solicitud" });
  } catch (error) {
    console.error("Error en RestorePasswordMessage:", error);
    return res
      .status(500)
      .send({ error: "Ocurrió un error al procesar la solicitud" });
  }
};

module.exports = {
  RestorePasswordMessage,
};
