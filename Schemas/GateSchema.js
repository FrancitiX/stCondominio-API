const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gateSchema = new Schema(
  {
    number: Number,
    name: String,
    date: { date: String, time: String },
  },
  {
    timestamps: true,
    collection: "gates",
  }
);

gateSchema.pre("save", function (next) {
  const dateMexico = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  const [datePart, timePart] = dateMexico.split(", ");
  this.date = { date: datePart, time: timePart };
  next();
});

mongoose.model("gate", gateSchema);