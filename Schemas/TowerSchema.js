const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const towerSchema = new Schema(
  {
    number: Number,
    name: String,
    departments: [String],
    date: { date: String, time: String },
  },
  {
    timestamps: true,
    collection: "towers",
  }
);

towerSchema.pre("save", function (next) {
  const dateMexico = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  const [datePart, timePart] = dateMexico.split(", ");
  this.date = { date: datePart, time: timePart };
  next();
});

mongoose.model("tower", towerSchema);