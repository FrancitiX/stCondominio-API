const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: {
        name: String,
        paternal_surname: String,
        maternal_surname: String,
      },
    },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    cellphone: Number,
    salt: String,
    password: String,
    rol: String,
    department: [ String ],
    tower: [ String ],
    date: { date: String, time: String },
  },
  {
    collection: "users",
  }
);

userSchema.pre("save", function (next) {
  const dateMexico = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  const [datePart, timePart] = dateMexico.split(", ");
  this.date = { date: datePart, time: timePart };
  next();
});

mongoose.model("users", userSchema);