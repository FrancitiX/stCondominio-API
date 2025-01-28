const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
require("dotenv").config();

require("./../Schemas/userSchema");
require("../Schemas/user_imageSchema");
const User = mongoose.model("users");
const userImage = mongoose.model("user_image");

const Salt = (username) => {
  if (!username || username.length < 2) {
    throw new Error("El nombre de usuario debe tener al menos 2 caracteres.");
  }

  const firstLetter = username[0].toLowerCase();
  const lastLetter = username[username.length - 1].toLowerCase();

  const randomPart = crypto.randomBytes(8).toString("hex");

  return `${firstLetter}${lastLetter}${randomPart}`;
};

const username = (name, number) => {
  if (!name || name.length < 2) {
    throw new Error("El nombre de usuario debe tener al menos 2 caracteres.");
  }

  const firstLetter = username[0].toLowerCase();
  const lastLetter = username[username.length - 1].toLowerCase();

  return `${firstLetter}${number}${lastLetter}`;
};

const registerUser = async (req, res) => {
  const {
    name,
    paternal_surname,
    maternal_surname,
    username,
    country,
    cellphone,
    password,
    email,
    rol,
  } = req.body;
  console.log(req.body);

  try {
    const salt = Salt(name);
    const pepper = process.env.PEPPER;
    const enPassword = await bcrypt.hash(pepper + password + salt, 12);
    const oldEmail = await User.findOne({ email: email });
    const user = username(name, cellphone);

    if (oldEmail) {
      res.status(400).json({
        status: "correo",
        data: "El correo ya está registrado!",
      });
    } else {
      console.log(user);
      
      // await User.create({
      //   name: { name, paternal_surname, maternal_surname },
      //   username: user,
      //   email,
      //   cellphone: { country, cellphone },
      //   salt: salt,
      //   pass: enPassword,
      //   type,
      // });
      // await userImage.create({
      //   username: user,
      //   image: "",
      //   bgimage: "",
      // });
      // res.status(201).json({ status: "ok", data: "Usuario creado" });
      // console.log("Usuario creado exitosamente");
    }
  } catch (error) {
    console.error("error: " + error);
    res
      .status(500)
      .json({ status: "error", data: "Error interno del servidor" });
  }
};

const loginUser = async (req, res) => {
  const { user, password } = req.body;
  console.log(user, password);
  console.log("");
  try {
    const userToCheck = await User.findOne({
      $or: [{ email: user }, { username: user }],
    });

    if (!userToCheck) {
      return res
        .status(404)
        .json({ status: "error", data: "Usuario no registrado" });
    }
    const { salt } = userToCheck;
    const pepper = process.env.PEPPER;
    const isPasswordValid = await bcrypt.compare(
      pepper + password + salt,
      userToCheck.pass
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "wrong password", data: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const payload = { id: userToCheck._id, username: userToCheck.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "ok",
      usuario: userToCheck.username,
      token: token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res
      .status(500)
      .json({ status: "error", data: "Error interno del servidor" });
  }
};

const userData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Error al iniciar sesion" });
  }
  console.log(token);
  console.log("");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = decoded;

    User.findOne({ username: username })
      .then((user) => {
        return res.status(200).json({ status: "ok", data: user });
      })
      .catch((err) => {
        // Manejo de errores si la promesa falla
        console.error("Error de búsqueda:", err);
        return res.status(500).send({ error: "Error interno del servidor" });
      });
  } catch (error) {
    console.error("Error we: ", error);
    return res.send({ error: error });
  }
};

const updateUser = async (req, res) => {
  const { image, username, email, password, newPassword } = req.body;
  try {
    if (!password) {
      await BC_U.updateOne(
        { username: username },
        {
          $set: {
            email,
          },
        }
      );
      await User.updateOne(
        { username: username },
        {
          $set: {
            email,
          },
        }
      );
    } else {
      const enPassword = await bcrypt.hash(newPassword, 12);

      const username = await User.findOne({ username: username });
      if (await bcrypt.compare(password, username.pass)) {
        await BC_U.updateOne(
          { username: username },
          {
            $set: {
              email,
              pass: enPassword,
            },
          }
        );
        await User.updateOne(
          { username: username },
          {
            $set: {
              email,
              pass: enPassword,
            },
          }
        );
      } else {
        res.send({ status: "error", data: "La contraseña actual no coincide" });
      }
    }
    res.send({ status: "ok", data: "Updated" });
  } catch (error) {
    return res.send({ error: error });
  }
};

const getAllUsers = async (req, res) => {
  let skip = parseInt(req.query.skip) || 0;

  try {
    const data = await User.find({}).skip(parseInt(skip)).limit(parseInt(10));

    const totalDocs = await User.countDocuments();
    const pages = {
      docs: data.length,
      totalDocs: totalDocs,
      totalPages: Math.ceil(totalDocs / 10),
    };

    res.status(200).send({ status: "ok", data: data, pages: pages });
  } catch (error) {
    return res.send({ error: error });
  }
};

const deleteUser = async (req, res) => {
  const { username } = req.body;
  try {
    await userImage.deleteOne({ username: username });
    await User.deleteOne({ username: username });

    res.send({ status: "ok", data: "User Deleted" });
  } catch (error) {
    console.error("No se borro el usuarioo");
    return res.send({ error: error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  userData,
  updateUser,
  getAllUsers,
  deleteUser,
};
