const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
app.use(express.json());

require("../Schemas/PenaltySchema");
const Penalty = mongoose.model("penalties");
const { newNotification } = require("./NotificationController");

const idPenalty = (title) => {
  if (!title) {
    throw new Error("La notificación debe tener un titulo.");
  }
  const random = crypto.randomBytes(10).toString("hex");

  if (title > 2) {
    const firstLetter =
      title[0].toUpperCase() + title[1].toUpperCase();

      const lastLetter =
      title[title.length - 1].toUpperCase();

    return `${firstLetter}-${random}${lastLetter}`;
  } else {
    const firstLetter = title[0].toUpperCase() + title[1].toUpperCase();

    return `${firstLetter}-${random}`;
  }
};

// Insertar multas
const newPenalty = async (req, res) => {
  try {
    const { user, title, department, tower, penalty, description, motivo } = req.body;
    console.log("Se añadio una Multa ");


    if (!user || !title || !department || !tower || !penalty) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const id = idPenalty(title, motivo)

    const multa = await Penalty.create({
      id,
      user,
      title,
      department,
      tower,
      penalty,
    });

    const notificationData = {
      department: department,
      tower,
      title: "Usted a sido multado",
      short: `Se ha registrado una multa para usted por ${motivo}`,
      description: description,
      type: "MULTA",
      recipients: [{ user: Array.isArray(user) ? user.join(", ") : user, read: false }],
    };

    try {
      await newNotification(
        { body: notificationData },
        { status: () => ({ json: () => {} }) }
      );
    } catch (error) {
      console.error("Error al crear la notificación:", error);
    }

    res.status(201).json({ status: "ok", data: multa });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar la multa" });
  }
};

const getPenalty = async (req, res) => {
  const user = req.body;

  try {
    const penaltys = await Penalty.find({ user: user })
      .skip(parseInt(skip))
      .limit(parseInt(10));

    const totalDocs = await Penalty.countDocuments();
    const pages = {
      docs: data.length,
      totalDocs: totalDocs,
      totalPages: Math.ceil(totalDocs / 10),
    };

    res.status(202).send({ status: "ok", data: penaltys, pages: pages });
  } catch (error) {
    console.error("Error al obtener la multa: ", error);
    res.status(500).json({ error: "Error al obtener la multa" });
  }
};

const get_All_Penalty = async (req, res) => {
  let skip = parseInt(req.query.skip) || 0;

  try {
    const penaltys = await Penalty.find({})
      .skip(parseInt(skip))
      .limit(parseInt(10));

    const totalDocs = await Penalty.countDocuments();
    const pages = {
      docs: data.length,
      totalDocs: totalDocs,
      totalPages: Math.ceil(totalDocs / 10),
    };

    res.status(200).send({ status: "ok", data: penaltys, pages: pages });
  } catch (error) {
    console.error("Error al obtener las multas:", error);
    res.status(500).json({ error: "Error al obtener las multas" });
  }
};

module.exports = {
  newPenalty,
  getPenalty,
  get_All_Penalty,
};
