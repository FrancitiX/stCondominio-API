const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MONGO_URL = process.env.DB_URI;
const PORT = process.env.PORT;
// const allowedOrigins = process.env.ORIGINS.split(",");


const app = express();

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(cors);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// conexiona mongo
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Conectado a MongoDB"), console.log("");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB", err), console.log("");
  });

app.listen(PORT, () => {
  console.log(""), console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get("/", (req, res) => {
  res.send({ status: "ok" });
});

//Controladores de solicitudes
const userController = require("./Controllers/userController");
const user_imageController = require("./Controllers/user_imageController");
const penaltyController = require("./Controllers/PenaltyController")

//Solicitudes a la base de datos para usuarios

app.post("/register", userController.registerUser);

app.post("/login", userController.loginUser);

app.post("/userData", userController.userData);

app.put("/updateUser", userController.updateUser);

app.get("/get-All-User", userController.getAllUsers);

app.delete("/deleteUser", userController.deleteUser);

//Solicitudes a la base de datos para imagenes

app.put(
  "/updateUser-Image",
  user_imageController.upload.single("image"),
  user_imageController.updateUserImages
);

app.post("/userImage", user_imageController.userImage);


//Solicitudes de Multas

app.post("/newPenalty", penaltyController.newPenalty);

app.post("/getPenaltys", penaltyController.getPenalty);

app.post("/get-All-Penaltys", penaltyController.get_All_Penalty);



// Dependencias

// npm install
// npm i express body-parser mongoose multer cors jsonwebtoken bcrypt
// npm install dotenv

