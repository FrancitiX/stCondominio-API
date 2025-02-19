const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
app.use(express.json());

require("../Schemas/TokenSchema");
const Token = mongoose.model("token");

// Insertar multas
const newSession = async (user, token, session) => {
  try {
    if (!user || !token) {
      console.log("Ocurrio un error al registrar la sesion");
      return false;
    }

    const newToken = await Token.create({
      user,
      token,
      session,
    });

    return newToken;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getSession = async (token, session) => {
  try {
    if (!session || !token) {
      console.log("Ocurrio un error al registrar la sesion");
      return false;
    }

    const Session = await Token.findOne({
      token: token,
      session: session,
    });

    return Session;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const closeSession = async (user, session) => {
  try {
    const session = await Token.findOne({ user, session });

    if (session) {
      await Token.deleteOne({ session });
      return true;
    }

    console.log("No se encontro la sesión");

    return false;
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
    return false;
  }
};

const close_All_Sessions = async (user) => {
  try {
    if (user) {
      const close = await Token.deleteMany({ user: user });

      return close;
    }

    console.log("No se encontro la sesión");

    return false;
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
    return false;
  }
};

module.exports = {
  newSession,
  getSession,
  closeSession,
  close_All_Sessions,
};
