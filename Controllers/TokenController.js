const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
app.use(express.json());

require("../Schemas/TokenSchema");
const Token = mongoose.model("token");

const addSession = (user) => {
  if (!user || user.length < 2) {
    throw new Error("Ocurrio un error con el usuario");
  }

  const firstLetter = name[0].toUpperCase() + name[1].toUpperCase();
  const lastLetter = name[name.length - 1].toUpperCase();

  const randomPart = crypto.randomBytes(5).toString("hex");

  return `${firstLetter}${lastLetter}${randomPart}`;
};

// Insertar multas
const newSession = async (req, res) => {
  try {
    const { user, token, sessions } = req.body;

    if (!user || !token) {
      return res
        .status(400)
        .json({ message: "Ocurrio un error al registrar la sesion" });
    }

    const multa = await Token.create({
      user,
      token,
      session,
      status: true,
    });

    res.status(201).json({ status: "ok", data: multa });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar la multa" });
  }
};

const getSession = async (req, res) => {
  try {
    const { user, token, session } = req.body;

    if (!user || !token) {
      return res
        .status(400)
        .json({ message: "Ocurrio un error al registrar la sesion" });
    }

    const multa = await Token.create({
      user,
      token,
      session,
      status: true,
    });

    res.status(201).json({ status: "ok", data: multa });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar la multa" });
  }
};

const closeSession = async (req, res) => {
  const { user, session_id } = req.body;

  try {
    const session = await Token.find({ user: user });

    if (session) {
      const close = await Token.deleteOne({ session: session_id });

      res.status(202).send({ status: "ok", data: close });
    }

    res.status(404).send({ status: "error", data: "No se encontro la sesión" });
  } catch (error) {
    console.error("Error al obtener la multa: ", error);
    res.status(500).json({ error: "Error al obtener la multa" });
  }
};

const close_All_Sessions = async (req, res) => {
  let skip = parseInt(req.query.skip) || 0;

  try {
    const Tokens = await Token.find({})
      .skip(parseInt(skip))
      .limit(parseInt(10));

    const totalDocs = await Token.countDocuments();
    const pages = {
      docs: data.length,
      totalDocs: totalDocs,
      totalPages: Math.ceil(totalDocs / 10),
    };

    res.status(200).send({ status: "ok", data: Tokens, pages: pages });
  } catch (error) {
    console.error("Error al obtener las multas:", error);
    res.status(500).json({ error: "Error al obtener las multas" });
  }
};

module.exports = {
  newSession,
  getSession,
  closeSession,
  close_All_Sessions,
};
