const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

require("../Schemas/PenaltySchema").default;
const Penalty = mongoose.model("penalty");

// Insertar multas
const newPenalty = async (req, res) => {
  try {
    const { user, name, department, tower, penalty } = req.body;

    if (!user || !name || !department || !tower || !penalty) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }
    const multa = await Penalty.create({
      user,
      name,
      department,
      tower,
      penalty,
    });

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
